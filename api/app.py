from flask import Flask, request, jsonify, make_response
from flask_restx import Api, Resource
from keras.models import load_model

import numpy as np
import pickle
import string

app = Flask(__name__)
api = Api(app)

model = load_model('.\models\s2s.hdf5')
encoder_model = load_model(".\models\encoder_model.hdf5")
decoder_model = load_model(".\models\decoder_model.hdf5")

with open('.\models\input_token_index.pickle', 'rb') as handle:
    input_token_index = pickle.load(handle)
    
with open('.\models\\target_token_index.pickle', 'rb') as handle:
    target_token_index = pickle.load(handle)
    
# Reverse-lookup token index to decode sequences back 
reverse_input_char_index = dict(
    (i, char) for char, i in input_token_index.items())
reverse_target_char_index = dict(
    (i, char) for char, i in target_token_index.items())

max_encoder_seq_length = 29

eos_token = target_token_index['eos']

# basic preprocessing
def process(text):
    text = text.lower().replace('\n', ' ').replace('-', ' ').replace(':', ' ').replace(',', '') \
          .replace('"', ' ').replace(".", " ").replace("!", " ").replace("?", " ").replace(";", " ").replace(":", " ")

    text = "".join(v for v in text if v not in string.punctuation).lower()
    #text = text.encode("utf8").decode("ascii",'ignore')

    text = " ".join(text.split())
    #text+="<eos>"
    return text


from math import log
def generate_beam_text(seed_text, next_words, beam_search_n, break_at_eos):
    
    distributions_scores_states = [[list(), 0.0, [None, None]]]
    
    decoder_states_value = None
    
    answers = []
    
    for _ in range(next_words):
        
        sequence_temp_candidates = list()
        
        for i in range(len(distributions_scores_states)): 
            
            input_seq = np.zeros(
                (1, max_encoder_seq_length), dtype="float32"
            )
            
            # Generate empty target sequence of length 1.
            target_seq = np.zeros((1,1))
            
            seq, score, states_values = distributions_scores_states[i]
            
            if len(distributions_scores_states) == 1:
                for t, word in enumerate(process(seed_text).split()):
                    input_seq[0, t] = input_token_index[word]
                
                # Encode the input as state vectors.
                decoder_states_value = encoder_model.predict(input_seq)
                
                # Populate the first character of target sequence with the start character.
                target_seq[0, 0] = target_token_index['bos']
                
            else:
                target_seq[0, 0] = seq[-1]
                decoder_states_value = states_values
                
                candidate_sentence = ""
                for token_index in seq:
                    if token_index == eos_token:
                        break
                        
                    word = reverse_target_char_index[token_index]
                    candidate_sentence+=word + " "
                
                #print("score :", score, " | ", candidate_sentence)
                answers.append((score, candidate_sentence))
            
            
            output_tokens_distribution, h, c = decoder_model.predict([target_seq] + decoder_states_value)
            
            # Update states
            decoder_states_value = [h, c]

            predicted_distribution = output_tokens_distribution[0][0]
            
            for j in range(len(predicted_distribution)):
                if predicted_distribution[j] > 0:
                    candidate = [seq + [j], score - log(predicted_distribution[j]), decoder_states_value]
                    if break_at_eos and j == eos_token:
                        continue
                    else:
                        sequence_temp_candidates.append(candidate)

        
        # 2. score and sort all candidates
        ordered = sorted(sequence_temp_candidates, key=lambda tup:tup[1])
        
        distributions_scores_states = ordered[:beam_search_n]
          
        #print("-----")
    
    final_return_list = [x[1] for x in sorted(answers, reverse = True)[:5]]
    return(final_return_list)


generate_beam_text("hi do you like to dance", 5, 5, False)


@api.route('/smartreply')
class SmartReply(Resource):
    # def options(self):
    #     response = make_response()
    #     response.headers.add("Access-Control-Allow-Origin", "*")
    #     response.headers.add('Access-Control-Allow-Headers', "*")
    #     response.headers.add('Access-Control-Allow-Methods', "*")
    #     return response

    def post(self):
        testString = process(request.json)
        answerlist = generate_beam_text(testString, 5, 5, False)
        response = jsonify({
            "statusCode": 200,
            "status":"smart replies created",
            "result": answerlist
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

if __name__ == "__main__":
    app.run(debug=True)
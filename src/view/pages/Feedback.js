import React, { useEffect } from 'react'

import Chip from '../components/Chip'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { db } from '../../firebase-config';
import {collection,doc,setDoc,addDoc} from 'firebase/firestore';

const Feedback = ({setPageTitle}) => {
    const [suggestion,setSuggestion]=useState(false)
    const [issue,setIssue]=useState(false)
    const [business,setBusiness]=useState(false)
    const [question,setQuestion]=useState(false)
    const [report,setReport]=useState(false)
    const [subjectHeader,setSubjectHeader]=useState('')
    const [feedbackBody,setFeedbackBody]=useState('')

    useEffect(()=>{setPageTitle('Feedback')},[])


    const handleSubmit = () => {
        if (feedbackBody==='' || subjectHeader===''){
            toast.error('Please fill required fields')
        }
        else{
            const user=JSON.parse(localStorage.getItem('user'))
        addDoc(collection(db, 'aRoomsFeedback'), {
            userEmail:user.email,
            suggestion:suggestion,
            issue:issue,
            business:business,
            question:question,
            report:report,
        subject:subjectHeader,
        feedback: feedbackBody
        }).then(value => {
        toast.success('Success, your feedback is:' + value.id)
        setSuggestion(false);
        setIssue(false);
        setBusiness(false);
        setQuestion(false);
        setReport(false);
        setSubjectHeader('');
        setFeedbackBody('');
        })
      }};

  return (
    <section class="bg-white dark:bg-gray-900">
  <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      <p class="mb-8 lg:mb-16 text-center text-gray-600 font-bold sm:text-2xl">Got a technical issue? Want to suggest a new activity? Have questions about our Business? Let us know.</p>
      <form action="#" class="space-y-8" onSubmit={e=>{e.preventDefault()}}>
        <div>
              <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 pb-2">Tags:</label>
              <Chip setChoice={setSuggestion} choice={suggestion} text={'Suggest New Activity'}/>
              <Chip setChoice={setIssue} choice={issue} text={'Technical Issue'}/>
              <Chip setChoice={setBusiness} choice={business} text={'Business'}/>
              <Chip setChoice={setQuestion} choice={question} text={'Question'}/>
              <Chip setChoice={setReport} choice={report} text={'Report User'}/>
          </div>
          <div>
              <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
              <input type="text" value={subjectHeader} onChange={e=>{setSubjectHeader(e.target.value)}} id="subject" class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required/>
          </div>
          <div class="sm:col-span-2">
              <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
              <textarea id="message" value={feedbackBody} onChange={e=>{setFeedbackBody(e.target.value)}} rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..." required></textarea>
          </div>
          <button type="submit" onClick={()=>{handleSubmit()}} class="py-3 px-5 text-sm font-medium text-center text-gray-900 rounded-lg bg-orange-300 sm:w-fit hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-primary-300">Send Feedback</button>
      </form>
  </div>
</section>
  )
}

export default Feedback
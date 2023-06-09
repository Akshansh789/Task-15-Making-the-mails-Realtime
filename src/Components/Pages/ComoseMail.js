import React, { useRef} from 'react';
import './Inbox'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function removeSpecialChar(mail) {
    let newMail = "";
    for (let i = 0; i < mail.length; i++) {
        if (mail[i] !== "@" && mail[i] !== ".") {
            newMail += mail[i]
        }
    }
    return newMail;
}

function ComposeMail() {
    const user = removeSpecialChar(useSelector(state => state.authentication.user));
    const receiver = useRef();
    const subject = useRef();
    const mailBody = useRef();
    const sender = useSelector(state => state.authentication.user);

    const handleSendMail = async (e) => {
        e.preventDefault();
        console.log("sended");
        console.log(receiver.current.value, subject.current.value, mailBody.current.value, sender);

        const newMail = {
            mailSubject: subject.current.value,
            mailContent: mailBody.current.value,
            Sender: sender,
            isReaded:false
        }

        if (receiver.current.value.length > 0 && mailBody.current.value.length > 0 && subject.current.value.length > 0) {

            try {
                let responce = await fetch(
                    `https://mail-data-d37a7-default-rtdb.firebaseio.com//mail/${removeSpecialChar(receiver.current.value)}.json`,
                    {
                        method: 'POST',
                        body: JSON.stringify(newMail),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (responce.ok) {
                    let data = await responce.json();
                    console.log(data);
                    alert("mail sent successfully");
                    try {
                        let responce = await fetch(
                            `https://mail-data-d37a7-default-rtdb.firebaseio.com//sentmail/${user}.json`,
                            {
                                method: 'POST',
                                body: JSON.stringify({...newMail,receiver:receiver.current.value}),
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }
                        )
                        if (responce.ok) {
                            let data = await responce.json();
                            console.log(data);
                           console.log("sent to sent mail")
                        } else {
                            throw new Error("Failed to send in sent mail")
                        }
                    } catch (error) {
                        console.log(error)
                    }

                } else {
                    throw new Error("Failed to send mail")
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            alert("please fill all the data")
        }
    }

    return (
        <>
            <div className="App container">
                <h1 className="text-center">
                    Draft your mail
                </h1>
                <div>
                    <input type="email" className="form-control" id="exampleInputEmail1" placeholder='To' ref={receiver} aria-describedby="emailHelp" />
                    <hr />
                </div>
                <div>
                    <input type="email" className="form-control" id="exampleInputSubject" ref={subject} aria-describedby="emailHelp" placeholder='Subject' />
                    <hr />
                </div>
                <textarea className='w-100' style={{ height: "20rem" }} ref={mailBody} placeholder='Draft your mail here' />

            </div>
            <div className='container  text-center'>
                <Button variant="primary" className='my-2 w-25' onClick={handleSendMail}>
                    Send
                </Button>
            </div>
        </>
    )
}

export default ComposeMail;

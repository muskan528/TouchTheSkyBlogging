import { useState } from "react";
import axios from 'axios'
import useUser from "../hooks/useUser";
const AddCommentForm = ({articleName, onArticleUpdated}) =>{
    const [name, setName]=useState('');
    const [commentText, setCommentText] = useState('');
    const {user}=useUser();
    const addComment=async() =>{
        const response=await axios.post(`/api/articles/${articleName}/comments`,{
            postedBy:name,
            text:commentText,
        });

        const updatedArticle=response.data
        console.log("Hello hi boliye")
        console.log(updatedArticle)
        onArticleUpdated(updatedArticle)
        setName('')
        setCommentText('')
    }
    return (
        <div id="add-comment-form">
            <h3>Add a comment</h3>
            {user && <p>You are posting as {user.email}</p>}
            <textarea value={commentText} onChange={e=> setCommentText(e.target.value)} rows="4" cols="50"/>
            <button onClick={addComment}>Add Commment</button>
        </div>
    )
}
export default AddCommentForm;
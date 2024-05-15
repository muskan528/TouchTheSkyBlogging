import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios'
import CommentsList from "../components/CommentsList";
import NotFoundPage from "./NotFoundPage";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo]=useState({upvotes:0, comments:[], canUpvote:false})
    const {canUpvote} = articleInfo
    const {articleId} = useParams();
    const {user, isLoading} = useUser();

    useEffect(()=>{
        const loadArticleInfo=async()=>{
            try{
                const token= user && await user.getIdToken()
                const headers=token? {authToken:token}:{};
                const response=await axios.get(`/api/articles/${articleId}`,{
                    headers
                })
                const newArticleInfo=response.data
                setArticleInfo(newArticleInfo)
            } catch(error) {
                console.error('Failed to fetch article')
            }

            if(isLoading)
                loadArticleInfo();
        };
        loadArticleInfo();
    },[isLoading, user])
    const navigate=useNavigate()
    const addUpvote = async () => {
        const token= user && await user.getIdToken()
        const headers=token? {authToken:token}:{};
        const response = await axios.put(`/api/articles/${articleId}/upvote`)
        const updateArticle=response.data
        setArticleInfo(updateArticle)
    }

    if(!articleInfo) {
        return <NotFoundPage/>
    }
    return (
        <>
            <h1>{articleInfo.title}</h1>
            <div className="upvotes-section">
                {user ? 
                    <button onClick={addUpvote}>{canUpvote?'Upvote' : 'Already Upvoted'}</button>
                    : <button>Log In to upvote</button> }
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            <p>{articleInfo.content}</p>
            
            {user ? 
                <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}/>
                :<button onClick={()=>{
                    navigate('/login')
                }}>Log in to add a comment</button>}
            <CommentsList comments={articleInfo.comments}/>
        </>
    );
}
export default ArticlePage;
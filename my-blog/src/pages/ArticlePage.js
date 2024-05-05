import { useParams } from "react-router-dom";
import articles from './article-content'
import { useState, useEffect } from "react";
import axios from 'axios'
import CommentsList from "../components/CommentsList";
import NotFoundPage from "./NotFoundPage";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo]=useState({upvotes:0, comments:[]})
    const {articleId} = useParams();
    const {user, isLoading} = useUser();

    useEffect(()=>{
        const loadArticleInfo=async()=>{
            try{
                const response=await axios.get(`/api/articles/${articleId}`)
                const newArticleInfo=response.data
                setArticleInfo(newArticleInfo)
            } catch(error) {
                console.error('Failed to fetch article')
            }
        };
        loadArticleInfo();
    },[articleId])
    
    const addUpvote = async () => {
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
                    <button onClick={addUpvote}> Upvote</button>
                    : <button>Log In to upvote</button> }
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            <p>{articleInfo.content}</p>
            
            {user ? 
                <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}/>
                :<button>Log in to add a comment</button>}
            <CommentsList comments={articleInfo.comments}/>
        </>
    );
}
export default ArticlePage;
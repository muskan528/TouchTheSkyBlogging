import axios from 'axios';
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

const ArticlesList = () => {
    const [articles, setArticles] = useState([]);
    useEffect(()=>{
        const fetchArticles=async () => {
            try {
                const response=await axios.get(`/api/articles`)
                setArticles(response.data);
            } catch(error) {
                console.error('Error fetching articles',error);
            }
        };

        fetchArticles();
    },[])
    return (
        
        <>
            {articles.map(article => (
                <Link key={article.name} className='article-list-item' to={`/articles/${article.name}`}>
                    <h3>{article.title}</h3>
                    <p>{article.content[0].substring(0,150)}...</p>
                </Link>))
            }
        </>
    )
}
export default ArticlesList;
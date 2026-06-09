import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id===`add-comment-btn-${e.target.dataset.uuid}`){

        handleAddComment(e.target.dataset.uuid)
    }
    else if(e.target.id===`delete-btn-${e.target.dataset.uuid}`){
        deleteTweet(e.target.dataset.uuid)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const previousLikes=Number(localStorage.getItem(`likes-${tweetId}`))
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
        localStorage.setItem(`likes-${tweetId}`,previousLikes-1)
    }
    else{
        targetTweetObj.likes++ 
        localStorage.setItem(`likes-${tweetId}`,previousLikes+1)

    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const previousReTweets=Number(localStorage.getItem(`retweets-${tweetId}`))
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
        localStorage.setItem(`retweets-${tweetId}`,previousReTweets-1)
    }
    else{
        targetTweetObj.retweets++
        localStorage.setItem(`retweets-${tweetId}`,previousReTweets+1)
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleAddComment(parentTweetId,e){
    const commentInput=document.getElementById(`comment-input-${parentTweetId}`)
     if(commentInput.value){
        tweetsData.forEach(function(tweet){
                    if(tweet.uuid===parentTweetId){
                        tweet.replies.push(
                  {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: `${commentInput.value}`,
            }
                        )
                    }
                    console.log(tweet.replies)
            })
        commentInput.value=''
    }
    render()
}

function deleteTweet(deleteUuid){
    tweetsData.forEach(function(tweet){
        if(tweet.uuid===deleteUuid){
            document.getElementById(`deleteTweet-${deleteUuid}`).style.display='none'
        }
    })
}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet" id='deleteTweet-${tweet.uuid}'>
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${localStorage.getItem(`likes-${tweet.uuid}`)}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${localStorage.getItem(`retweets-${tweet.uuid}`)}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash-can delete-btn" 
                    id='delete-btn-${tweet.uuid}'
                    data-uuid=${tweet.uuid}></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class='add-comment-section'>
            <textarea class='comment-input' id='comment-input-${tweet.uuid}' placeholder='Add comment!'></textarea>
            <button class='add-comment-btn' id='add-comment-btn-${tweet.uuid}' data-uuid=${tweet.uuid}>Add comment</button>
        </div>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

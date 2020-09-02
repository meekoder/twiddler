const formatDate = (dateObj) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let hours = dateObj.getHours();
  const mins = dateObj.getMinutes();
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  let amOrPm = 'AM';
  if (hours > 12) {
    amOrPm = 'PM';
  }
  if (hours > 12 || hours === 0) {
    hours = Math.abs(hours - 12);
  }
  const time = `${hours}:${mins} ${amOrPm}`;
  const date = `${month} ${day}, ${year}`;
  const formattedDate = `${date} \xB7 ${time}`;
  return formattedDate;
};

const twiddleMedia = (twiddleObj) => {
  let $main = $('#main');
  let $article = $('<article class="media" id="#a-twiddle"/>');
  let username = twiddleObj.user;
  let twiddle = twiddleObj.message;
  let dateCreated = formatDate(twiddleObj.created_at);
  let $userMedia = $('<div class="media-content" />');
  let $tweet = $('<div class="content" />');
  let $user = $('<p />');
  let $image = $('<img />');
  let $profilePic = $('<figure class="media-left" />');
  let $profileSize = $('<p class="image is-64x64" />');
  let $interaction = $(`<nav class='level is-mobile'>
          <div class='level-left'>
            <a class='level-item'>
              <span class='icon is-small'><i class='fas fa-reply'></i></span>
            </a>
            <a class='level-item'>
              <span class='icon is-small'><i class='fas fa-retweet'></i></span>
            </a>
            <a class='level-item'>
              <span class='icon is-small'><i class='fas fa-heart'></i></span>
            </a>
          </div>
        </nav>`);
  $image.attr('src', `./assets/${username}.png`)
    .appendTo($profileSize)
  $profilePic.append($profileSize);
  $tweet.append('<p />')
    .text(`${twiddle}`)
  $user.text(`@${username} ${dateCreated}`)
    .css('font-weight', 'bold')
    .prependTo($tweet);
  $userMedia.append($tweet, $interaction);
  $article.append($profilePic, $userMedia)
    .prependTo($main);
};

$(document).ready(function(){
  streams.home.forEach(x => twiddleMedia(x));
  let callCount = 0;
  const originalAddTweet = addTweet;

  addTweet = function(...arguments) {
    callCount += 1;
    if (callCount === 1) {
      $('#new-twiddle-card').after('<button class="button is-info is-rounded" id="new-twiddles" />');
    }
    newTweetTrigger(...arguments);
    return originalAddTweet(...arguments);
  }

  const newTweetTrigger = () => {
    $('#new-twiddles').text(`${callCount} New Twiddles!`)
      .click(handleLoadNewTwiddles);
  };

  const handleLoadNewTwiddles = () => {
    const newTwiddlesLength = streams.home.length - callCount; 
    const newTwiddlesArr = streams.home.slice(newTwiddlesLength);
    callCount = 0;
    $('#new-twiddles').remove();
    newTwiddlesArr.forEach(x => twiddleMedia(x));
  };
});


// const handleNewTwiddle = () => {
  
// }

// $('#twiddle').click(handleNewTwiddle);

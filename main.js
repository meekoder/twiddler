const formatDate = (dateObj) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let hours = dateObj.getHours();
  let mins = dateObj.getMinutes();
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
  mins = ('0' + mins).slice(-2);
  const time = `${hours}:${mins} ${amOrPm}`;
  const date = `${month} ${day}, ${year}`;
  const formattedDate = `${time} \xB7 ${date}`;
  return formattedDate;
};

const displayHomeFeed = (twiddleObj) => {
  const $main = $('#main');
  const $article = $('<article class="media" id="#a-twiddle"/>');
  const username = twiddleObj.user;
  const twiddle = twiddleObj.message;
  const dateCreated = formatDate(twiddleObj.created_at);
  const $userMedia = $('<div class="media-content" />');
  const $tweet = $('<div class="content" />');
  const $user = $('<p />');
  const $image = $('<img />');
  const $profilePic = $('<figure class="media-left" />');
  const $profileSize = $('<p class="image is-64x64" />');
  const $interaction = $(`<nav class='level is-mobile'>
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
          <div class='level-right' id='date'>
          </div>
        </nav>`);
  // const $date = $('<p class="level-item" />');
  // $date.text(`${dateCreated}`)
  //   .appendTo('#date');
  $image.attr('src', `./assets/${username}.png`)
    .appendTo($profileSize);
  $image.click(twiddleObj.handleProfileClick);
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

streams.home.map(obj => {
  obj.handleProfileClick = () => {
    const userTwiddles = streams.users[obj.user];
    $('#new-twiddles').remove();
    $('#main').empty();
    userTwiddles.forEach(x => displayHomeFeed(x));
  }
  return obj;
});
$(document).ready(function(){
  streams.home.forEach(x => displayHomeFeed(x));
  console.log(streams)
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
    newTwiddlesArr.forEach(x => displayHomeFeed(x));
  };
});


// const handleNewTwiddle = () => {
  
// }

// $('#twiddle').click(handleNewTwiddle);

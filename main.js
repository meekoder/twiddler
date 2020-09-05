// Handlers

const addHandleClickProp = (arrOfTwiddles) => {
  arrOfTwiddles.map(obj => {
    obj.handleProfileClick = () => {
      const username = obj.user;
      const userTwiddles = streams.users[username];
      $('#new-twiddles').remove();
      $('#main').empty();
      displayHomeFeed(userTwiddles);
    }
    return obj;
  });
};

const handleLoadNewTwiddles = () => {
  const newTwiddlesLength = streams.home.length - callCount; 
  const newTwiddlesArr = streams.home.slice(newTwiddlesLength);
  callCount = 0;
  $('#new-twiddles').remove();
  displayHomeFeed(newTwiddlesArr);
};

const handleNewTwiddle = () => {
  if (username.length < 1 || twiddle.length < 1) {
    alert('Please fill out both fields before adding your Twiddle!');
  } else {
    const username = $('#username').val();
    const twiddle = $('#twiddle').val();
    const newTwiddle = {};
    newTwiddle.user = username;
    newTwiddle.message = twiddle;
    newTwiddle.created_at = new Date();
    if (!streams.users[username]) {
      streams.users[username] = [];
    }
    addTweet(newTwiddle);
    displayHomeFeed([newTwiddle]);
    streams.currentUser = username;
    $('#twiddle').val(''); 
    $('#username').prop('disabled', true);
    $('#change-username').show()
      .click(handleChangeUserName);
  }
};

const handleChangeUserName = () => {
  const $twiddle = $('#twiddle'); 
  const $username = $('#username');
  const $newTwiddleBtn = $('#add-new-twiddle');
  const currentUserName = streams.currentUser;
  $username.prop('disabled', false);
  $twiddle.prop('disabled', true);
  $newTwiddleBtn.prop('disabled', true);
  $('#username').on('change keyup paste', () => {
    $('#change-username').hide();
    $('#save-changes').show()
      .click(() => {
        const newUserName = $username.val();
        $username.prop('disabled', true);
        $twiddle.prop('disabled', false);
        $newTwiddleBtn.prop('disabled', false);
        streams.users[newUserName] = streams.users[currentUserName];
        streams.currentUser = newUserName;
        streams.home.map(obj => {
          if (obj.user === currentUserName) {
            obj.user = newUserName;
          }
        });
        $('#save-changes').hide();
        $('#change-username').show();
      });
  });
};

// Helpers

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

const displayHomeFeed = (arrOfTwiddles) => {
  addHandleClickProp(arrOfTwiddles);
  arrOfTwiddles.forEach(twiddleObj => {
    const username = twiddleObj.user;
    const twiddle = twiddleObj.message;
    const dateCreated = formatDate(twiddleObj.created_at);
    const $main = $('#main');
    const $article = $('<article class="media" />');
    const $userMedia = $('<div class="media-content" />');
    const $tweet = $('<div class="content" />');
    const $user = $('<p />');
    const $image = $('<img  id="profile-icon"/>');
    const $profilePic = $('<figure class="media-left" />');
    const $profileSize = $('<p class="image is-64x64" />');
    const $date = $('<div class="level-right" />');
    const $interaction = $(`<nav class='level is-mobile'>
          <div class='level-left'>
            <a class='level-item'>
              <span class='icon is-small'><i class='fas fa-heart'></i></span>
            </a>
          </div>
        </nav>`);
    $date.text(`${dateCreated}`)
      .appendTo($interaction);
    $image.attr({
      'src': `./assets/${username}.png`,
      'onerror': `this.src="./assets/default.png"`
    })
      .css('cursor', 'pointer')
      .appendTo($profileSize)
      .click(twiddleObj.handleProfileClick);
    $user.click(twiddleObj.handleProfileClick);
    $profilePic.append($profileSize);
    $tweet.append('<p />')
      .text(`${twiddle}`)
    $user.text(`@${username}`)
      .css({'font-weight': 'bold',
        'cursor': 'pointer'
      })
      .prependTo($tweet);
    $userMedia.append($tweet, $interaction);
    $article.append($profilePic, $userMedia)
      .prependTo($main);
  });
};

// Counts number of times addTweet is called
let callCount = 0;
const originalAddTweet = addTweet;

addTweet = (...arguments) => {
  callCount += 1;
  if (callCount === 1) {
    $('#new-twiddle-card').after('<button class="button is-rounded" id="new-twiddles" />');
  }
  newTweetTrigger(...arguments);
  return originalAddTweet(...arguments);
}

const newTweetTrigger = () => {
  $('#new-twiddles').text(`${callCount} New Twiddles!`)
    .click(handleLoadNewTwiddles);
};

$(document).ready(() => {
  streams.currentUser = '';
  console.log(streams)
  displayHomeFeed(streams.home);
  $('#add-new-twiddle').click(handleNewTwiddle);
  $('#user-pic, #user-twiddles').click(() => {
    $('#new-twiddles').remove();
    $('#main').empty();
    displayHomeFeed(streams.users[streams.currentUser]);
  });
  $('#twitter-icon, #home').click(() => {
    callCount = 0;
    $('#new-twiddles').remove();
    displayHomeFeed(streams.home);
  });
});

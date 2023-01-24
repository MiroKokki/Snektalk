
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsjDa8dQL4kxXg7Yrx_fTewS9pixVK2_E",
  authDomain: "snektalk-41b50.firebaseapp.com",
  projectId: "snektalk-41b50",
  storageBucket: "snektalk-41b50.appspot.com",
  messagingSenderId: "625439812905",
  appId: "1:625439812905:web:d46308af63f024a703db38",
  measurementId: "G-NF11X4WBZG"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messaging = firebase.messaging();
firebase.auth().onAuthStateChanged( function(user) {
  if (user && !user.isDisabled) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (user.isDisabled) {
          console.log('This user account has been disabled');
          firebase.auth().signOut();
          window.location.replace('/Snektalk');
        } else {
          console.log('This user is authenticated');
        }
      } else {
        console.log('There is no authenticated user');
      }
    });
    var uid = user.uid;
    var username = user.displayName;
    const urlParams = new URLSearchParams(window.location.search);
    var room = urlParams.get('room');
    var roomtext = document.getElementById('room12');
    roomtext.innerHTML = 'Room:'+room+'<span class="material-symbols-outlined" style="position: relative;bottom: -5px;">expand_more</span>';
    if (room == "null"||room == null||room == ""){
      //("it running");
      //window.location.search = "room=50";
      document.getElementById("chat-txt").disabled = true;
      document.getElementById("chat-btn").disabled = true;
      document.getElementById("fileInput").disabled = true;
      document.getElementById("label1").id = "label12";
      document.getElementById("online-users").style.display = "none";
      
      roomtext.innerHTML = '';
      // Create the new element
      var text1 = document.createElement("div");

      // Set the text and ID of the element
      text1.innerHTML = "No chat-room selected please select a chat room from the menu!";
      text1.id = "text1";

      // Set the CSS styles of the element
      text1.style.position = "fixed";
      text1.style.top = "50%";
      text1.style.left = "50%";
      text1.style.transform = "translate(-50%, -50%)";
      text1.style.fontSize = "50px";
      text1.style.color = "rgba(255, 255, 255, 0.5)";
      text1.style.zIndex = "999";
      text1.style.textAlign = "center";

      // Append the element to the body
      document.body.appendChild(text1);

    }
console.log(username+" , "+room+" , "+uid)
document.getElementById("send-message").addEventListener("submit", postChat);
function postChat(e) {
if (document.getElementById("chat-txt") == '')
{return;}else
{ e.preventDefault();
const timestamp = Date.now();
const chatTxt = document.getElementById("chat-txt");
const message = chatTxt.value;
chatTxt.value = "";
if (message == "")return;else{
db.ref("messages/"+room+"/" + timestamp).set({
  usr: username,
  msg: message,
  uid: uid,
  timestamp: timestamp,
  edited: false
});}}
}



function uploadFile() {
  const storage = firebase.storage();
  const file = document.querySelector("#fileInput").files[0];

  if (!file) {
    return;
  }

  if (file.size > 52428800) {
    alert("File is too big! must be under 50mb");
    return;
  }
  const storageRef = storage.ref();

  // Create a reference to the images folder
  const imagesFolderRef = storageRef.child("images");

  // Create a child reference for the file
  const fileRef = imagesFolderRef.child(file.name);


  const uploadTask = fileRef.put(file);

  uploadTask.on(
    "state_changed",
    function(snapshot) {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      updateProgress(progress);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log("Upload is running");
          break;
      }
    },
    function(error) {
      console.error(error);
    },
    function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        updateProgress(0);
        console.log("File available at", downloadURL);
        const timestamp = Date.now();

        db.ref("messages/"+room+"/" + timestamp).set({
          usr: username,
          msg: downloadURL,
          uid: uid,
          timestamp: timestamp,
          edited: false
        });
      });
    }
  );
}


document.getElementById('fileInput').addEventListener('change', uploadFile);
const fetchChat = db.ref("messages/"+room+"/");
fetchChat.on("child_added", function (snapshot) {
const messages = snapshot.val();
if (messages.uid == uid){
  var message;
  if (isLink(messages.msg)) {
    if (isImageLink(messages.msg)) {
      var message = createImageString(messages.msg);
    } else {
      var message = urlToLink(messages.msg);
    }
  } else {
    var message = messages.msg;
  }
  if(snapshot.key == 'onlineUsers'||snapshot.key == 'typeing'){
    return;
  }
  //var message = messages.msg;
  //var date1 = new Date;
//date.setTime(messages.timestamp);
var date = moment(messages.timestamp).format('MM/DD/YYYY, h:mm a');

const msg = `<div class='box2 sb13' id='${snapshot.key}' ><p class='delete1' onclick='delete1( "${snapshot.key}" )'><img src="delete.png" style="width:15px;"></img></p>
         <p class='update1' onclick="editMessage('${snapshot.key}');"><img src="edit.png" style="width:15px;"></img></p>
          <p class='useryou'> ${date} — You</p><p class="message-text">${message}</p></div>`;

document.getElementById("messages").innerHTML += msg;
window.scrollTo(0,document.body.scrollHeight);

}else{
  var message;
  if (isLink(messages.msg)) {
    if (isImageLink(messages.msg)) {
      var message = createImageString(messages.msg);
    } else {
      var message = urlToLink(messages.msg);
    }
  } else {
    var message = messages.msg;
  }
  if(snapshot.key == 'onlineUsers'){
    return;
  }
  //var date1 = new Date;
//date.setTime(messages.timestamp);
  //var message = messages.msg;
  var date = moment(messages.timestamp).format('MM/DD/YYYY, h:mm a');
  if(uid == "UmZ4HO5ADDaVUGB8NQaLnjoMGej2"||uid =="MiMJ16EqTiai9AnAkiAUQR3zpbw2"||uid =="B7HbybJ7tBTDQNtHH4z4lBpLVKW2"||uid == "SIUwxc2sYydjuVhq9LCglyGa2az2"){
    const msg = `<div class='box3 sb14' id='${snapshot.key}'><p class='delete2' onclick='delete1( "${snapshot.key}" )'><img src="delete.png" style="width:15px;"></img></p><p class='user'> ${messages.usr} — ${date}</p><p class="message-text">${message}</p></div>`;
    document.getElementById("messages").innerHTML += msg;
  }else{
    const msg = `<div class='box3 sb14' id='${snapshot.key}'><p class='user'> ${messages.usr} — ${date}</p><p class="message-text">${message}</p></div>`;
    document.getElementById("messages").innerHTML += msg;
  }
  
window.scrollTo(0,document.body.scrollHeight);


}
});
window.onload = function() {
  window.scrollTo(0,document.body.scrollHeight);
};

window.scrollTo(0,document.body.scrollHeight);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (user.isDisabled) {
      console.log('This user account has been disabled');
      firebase.auth().signOut();
      window.location.replace('/');
    } else {
      console.log('This user is authenticated');
    }
  } else {
    console.log('There is no authenticated user');
  }
});
window.scrollTo(0,document.body.scrollHeight);
window.scrollTo(0,document.body.scrollHeight);
  } else {
    firebase.auth().signOut();
    window.location.replace('/');
  }
});
function isLink(string) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(string);
}
function createImageString(link) {
  // Create regular expressions to match image, video and audio file extensions
  var imageRegex = /\.(jpeg|jpg|gif|png|bmp|tiff|webp|)(\?.*)?(#.*)?$/i;
  var videoRegex = /\.(mp4|webm|ogg|ogv|wmv|flv|avi|mov|m4v|mkv|)(\?.*)?(#.*)?$/i;
  var audioRegex = /\.(mp3|wav|m4a)(\?.*)?(#.*)?$/i;

  // Test the link against the regular expressions
  if (imageRegex.test(link) || videoRegex.test(link) || audioRegex.test(link)) {
    if (imageRegex.test(link)) {
      // Create the img element as a string
      var imgString = '<img src="' + link + '" alt="An image">';
      return imgString;
    } else if (videoRegex.test(link)) {
      var videoString = '<video width="270px" height="auto" controls><source src="' + link + '" type="video/mp4"></video>';
      return videoString;
    } else if (audioRegex.test(link)) {
      var audioString = '<audio width="200px" height="auto" controls><source src="' + link + '" type="audio/mpeg"></audio>';
      return audioString;
    }
  }
  // Return an empty string if the link is not an image, video or audio
  return '';
}



function urlToLink(text) {
  const urls = text.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g);
  if (urls) {
    let isFirebaseStorageLink = text.indexOf("firebasestorage.googleapis.com") !== -1;
    if(isFirebaseStorageLink == true){
    for (let url of urls) {
      let parts = url.split(/[F?]/);
      let filename = parts[Math.floor(parts.length / 2)];
      text = text.replace(url, `<a href="${url}">${filename}</a>`);
    }}else{
      for (let url of urls) {
        text = text.replace(url, `<a href="${url}">${url}</a>`);
      }
    }
  }
  return text;
}


function isImageLink(link) {
  // Create regular expressions to match image and video file extensions
  var imageRegex = /^https?:\/\/.+\.(jpeg|jpg|gif|png|bmp|tiff|webp)(\?.*)?$/i;
  var videoRegex = /^https?:\/\/.+\.(mp4|webm|ogg|ogv|wmv|flv|avi|mov|m4v|mkv)(\?.*)?$/i;
  var audioRegex = /^https?:\/\/.+\.(mp3|wav|m4a)(\?.*)?$/i;


  // Test the link against the regular expressions
  return imageRegex.test(link) || videoRegex.test(link) || audioRegex.test(link);
}


function googleSignout() {
  firebase.auth().signOut()
  .then(function() {
     window.location.replace('/');
  }, function(error) {
  });
}
firebase.auth().onAuthStateChanged(function(user) {
  console.log("1");
  if (user) {
    console.log("2");
    if (user.isDisabled) {
      console.log("3");
      console.log('This user account has been disabled');
      firebase.auth().signOut();
      window.location.replace('/');
    } else {
      console.log('This user is authenticated');
    }
  } else {
    console.log('There is no authenticated user');
  }
});
firebase.auth().onIdTokenChanged(function(user) {
  console.log("1");
  if (user) {
    console.log("2");
    if (user.isDisabled) {
      console.log("3");
      console.log('This user account has been disabled');
      firebase.auth().signOut();
      window.location.replace('/');
    } else {
      console.log('This user is authenticated');
    }
  } else {
    console.log('There is no authenticated user');
  }
});


const urlParams = new URLSearchParams(window.location.search);
var room = urlParams.get('room');

const onlineUsersRef = firebase.database().ref("messages/" + room + "/onlineUsers");

onlineUsersRef.once("value", function(snapshot) {
  if (!snapshot.exists()) {
    onlineUsersRef.set({});
  }
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Add the current user to the list of online users when they log in
    onlineUsersRef.child(user.uid).set(user.displayName);

    // Remove the current user from the list of online users when they log out
    window.onbeforeunload = function() {
      onlineUsersRef.child(user.uid).remove();
    }

    // Listen for changes to the list of online users and update the user interface accordingly
    onlineUsersRef.on("value", function(snapshot) {
      var onlineUsers = snapshot.val();
      var onlineUsersList = document.getElementById("online-users-list");
      onlineUsersList.innerHTML = "";
      for (var userId in onlineUsers) {      
      var li = document.createElement("li");
      li.innerHTML = onlineUsers[userId];
      onlineUsersList.appendChild(li);
      }
    });
  } else {
    console.log("No user is currently logged in.");
  }
});





// Initialize a reference to the room
const roomRef1 = db.ref("messages/"+room);

// Listen for child removed events on the room
roomRef1.on("child_removed", function(snapshot) {
  // Check if the message has been deleted
  console.log("running");
    // Get the div element with the matching id
    console.log("running1");
    var messageDiv = document.getElementById(snapshot.key);
    // Remove the div element from the page
    messageDiv.remove();
});

function delete1(toremove){
var childNode = db.ref("messages/"+room+"/"+toremove);

// Remove the child node
childNode.remove()
  .then(function() {
    console.log("Remove succeeded.")
  })
  .catch(function(error) {
    ("Remove failed: " + error.message)
  });
}
const progressBar = document.querySelector(".progress-bar .progress");
const progress_bar = document.getElementById("progress-bar");
const progress1 = document.getElementById("progress");

// Update the progress bar
function updateProgress(percentage) {
  progress_bar.style.display = 'block';
  progress1.style.display = 'block';
  progressBar.style.width = percentage + "%";
  if(percentage == 0){
  progress_bar.style.display = 'none';
  progress1.style.display = 'none';
  }
}
const messagesRef = db.ref("messages/" + room);

messagesRef.on("child_changed", function(snapshot) {
  // Get the message data from the snapshot
  const message = snapshot.val();

  // Get the message div with the same timestamp as the changed message
  const messageDiv = document.getElementById(message.timestamp);
if (messageDiv) {
  const messageText = messageDiv.querySelector(".message-text");
  messageText.innerHTML = message.msg;
}
});
function editMessage(key) {
  const messagesRef = db.ref("messages/" + room + "/" + key);
  messagesRef.once("value", function(snapshot) {
    const currentMessage = snapshot.val().msg;
    const newMessage = prompt("New message:", currentMessage);
    if (newMessage === null || newMessage === "") {
      // User pressed "Cancel" or left the prompt empty
      // Reset the message to its original value
  
    // Update the message in the database
    messagesRef.update({ msg: currentMessage });
    } else {
      // Update the message in the database
      updateMessage(key, newMessage);
    }
  });
}


function updateMessage(key, newMessage) {
  // Reference to the messages node in the database
  const messagesRef = db.ref("messages/" + room + "/" + key);

  // Update the message in the database
  messagesRef.update({ msg: newMessage, edited: true });
}
let previousWidth = window.innerWidth;

window.onresize = function() {
  if (previousWidth !== window.innerWidth) {
    const chatTxt = document.getElementById("chat-txt");
    chatTxt.style.width = "100%";
    previousWidth = window.innerWidth;
  }
}
function playSound1() {
  var sound = document.getElementById("audio1");
  sound.play();
}

const button = document.getElementById("color-button");

button.addEventListener("click", function() {
  const color = window.prompt("Enter a color (e.g. red, #ff0000, rgb(255, 0, 0))");
  // Change the background color of the button
  document.documentElement.style.setProperty('--color', color);
    document.getElementById("theme-picker-popup").style.display = "none";
    localStorage.setItem("color", color);
});

  
    // The JavaScript for showing and hiding the side bar
  document.getElementById('menu-button').addEventListener('click', function() {
    document.getElementById('side-bar').classList.toggle('visible');
    var overlay = document.getElementById("overlay");
    if (overlay.style.display == "block") {
      overlay.style.display = "none";
    } else {
      overlay.style.display = "block";
    }
  
  
  });
  
  
  
  
  var elem = document.getElementById('online-users');function slide() {
    elem.classList.toggle('hide');
    var roomtext = document.getElementById('room12');
    if(roomtext.innerHTML == 'Room:'+room+'<span class="material-symbols-outlined" style="position: relative;bottom: -5px;">expand_more</span>'){roomtext.innerHTML = 'Room:'+room+'<span class="material-symbols-outlined" style="position: relative;bottom: -5px;">expand_less</span>';}else{
    roomtext.innerHTML = 'Room:'+room+'<span class="material-symbols-outlined" style="position: relative;bottom: -5px;">expand_more</span>';}
  }
  
  
  
  
  
    var userName = document.getElementById('user-name');
        
        // Add an event listener for the auth state changed event
        firebase.auth().onAuthStateChanged(function(user) {
          // If the user is logged in, display their name
          if (user) {
            userName.innerHTML = user.displayName;
          }
        });
        const optionsButton = document.getElementById('options-button');
        const dropdownContent = document.querySelector('.dropdown-content');
        optionsButton.addEventListener('click', function() {
        if (dropdownContent.style.display === 'none') {
            dropdownContent.style.display = 'block';
        } else {
            dropdownContent.style.display = 'none';
        }
        });
  
  
  // Add an event listener to the "Change Theme" button
  document.getElementById("theme-picker-button").addEventListener("click", function() {
    document.getElementById("theme-picker-popup").style.display = "block";
  });
  
  // Add an event listener to the "Close" button inside the pop-up
  document.getElementById("theme-picker-close").addEventListener("click", function() {
    document.getElementById("theme-picker-popup").style.display = "none";
  });
  
  
  
        const deleteAccountOption = document.getElementById('delete-account-option');
  const changePasswordOption = document.getElementById('change-password-option');
  
  deleteAccountOption.addEventListener('click', function() {
    // Delete the user's account using the Firebase auth API
    if (confirm("Your about to delete your account!\nAre you sure?") == true) {
      firebase.auth().currentUser.delete().then(function() {
        firebase.auth().signOut();
      }).catch(function(error) {
        console.log(error.message);
        alert("Error:\n"+ error.message);
      });
    }
  });
  
  const changeUsernameOption = document.getElementById('change-username-option');
  
  changeUsernameOption.addEventListener('click', function() {
    // Prompt the user to enter their new username
    const newUsername = prompt('Enter your new username:');
    
    // Update the user's profile with the new username
    firebase.auth().currentUser.updateProfile({
      displayName: newUsername
    }).then(function() {
      userName.innerHTML = firebase.auth().currentUser.displayName;
      alert("Username updated");
    }).catch(function(error) {
      alert("Error:\n"+ error.message);
    });
  });
  
  
  changePasswordOption.addEventListener('click', function() {
    // Change the user's password using the Firebase auth API
    var newPassword = prompt("Enter new password");
    console.log(newPassword);
    if (newPassword != ''){
    firebase.auth().currentUser.updatePassword(newPassword).then(function() {
      alert("Password updated");
    }).catch(function(error) {
      console.log(error.message);
      alert("Error:\n"+ error.message);
    });
  }else{
    prompt("Please enter a password");
  }
  });
  
  
  var chatgroupList = document.querySelector("#chatgroupList");
  var newchatgroup = document.querySelector("#newchatgroup");
  var btnAddchatgroup = document.querySelector("#button1");
  
  btnAddchatgroup.addEventListener("click", addchatgroup);
  
  function addchatgroup(){
    if (newchatgroup.value !== "") {
      var li = document.createElement("p");
      li.classList.add("chatgroup");
  
      var a = document.createElement("a");
      a.textContent = newchatgroup.value;
      a.setAttribute("href", "?room="+a.textContent);
      li.appendChild(a);
  
      var span = document.createElement("span");
      span.classList.add("delete");
      span.classList.add("remove");
      span.innerHTML = "<span class='material-symbols-outlined' style='color:white;'  >delete</span>";
      span.addEventListener("click", removechatgroup);
  
      li.appendChild(span);
      chatgroupList.appendChild(li);
      newchatgroup.value = "";
    }
  }
  
  function removechatgroup(event){
    chatgroupList.removeChild(event.target.closest(".chatgroup"));
  }
  
  
  // Load the chat groups from localStorage when the page loads
  window.addEventListener("load", function() {
    var storedChatGroups = localStorage.getItem("chatGroups");
    if (storedChatGroups) {
      chatgroupList.innerHTML = storedChatGroups;
      // Reattach event listeners to delete buttons
      var deleteButtons = document.querySelectorAll(".remove");
      deleteButtons.forEach(function(button) {
        button.addEventListener("click", removechatgroup);
      });
    }
  });
  
  // Save the chat groups to localStorage when the page unloads
  window.addEventListener("unload", function() {
    localStorage.setItem("chatGroups", chatgroupList.innerHTML);
  });
  
  document.addEventListener("DOMContentLoaded", function() {
    // Get the chat-txt and label1 elements
    const chatTxt = document.getElementById("chat-txt");
    const label1 = document.getElementById("label1");
    const label2 = document.getElementById("chat-btn");
  
    setInterval(function(){
      const chatTxt = document.getElementById("chat-txt");
      const label1 = document.getElementById("label1");
      const label2 = document.getElementById("chat-btn");
      // Get the bounding rectangles of the chat-txt and label1 elements
      const chatTxtRect = chatTxt.getBoundingClientRect();
      const label1Rect = label1.getBoundingClientRect();
      const label2Rect = label2.getBoundingClientRect();
  
      // Check if the rectangles are colliding
      if (chatTxtRect.right > label1Rect.left && chatTxtRect.left < label1Rect.right && 
          chatTxtRect.bottom > label1Rect.top && chatTxtRect.top < label1Rect.bottom || chatTxtRect.right > label2Rect.left && chatTxtRect.left < label2Rect.right && 
          chatTxtRect.bottom > label2Rect.top && chatTxtRect.top < label2Rect.bottom) {
        // If they are, reduce the width of the chat-txt element
        const widthInPixels = window.getComputedStyle(chatTxt, null).getPropertyValue("width");
        const currentWidth = parseInt(widthInPixels);
        chatTxt.style.width = (currentWidth - 10) + "px";
      }
  
    }, 100);
  });
  
  
  
  firebase.auth().onAuthStateChanged(function(user) {
    console.log(user);
  if (user) {
    // Check if the user's account is disabled
    if (user.isDisabled) {
      console.log('This user account has been disabled');
      firebase.auth().signOut();
      window.location.replace('/');
    } else {
      console.log('This user is authenticated');
      
    }
  } else {
    console.log('There is no authenticated user');
  }
});

// Function to disable a user account
function disableUserAccount(user) {
  user.updateUser({
    disabled: true
  })
  .then(function() {
    console.log("User account disabled successfully");
  })
  .catch(function(error) {
    console.error("Error disabling user account:", error);
  });
}

  /*
  // Create the menu element
  var menu = document.createElement("div");
  menu.id = "custom-menu";
  menu.style.display = "none";
  document.body.appendChild(menu);
  
  // Add menu items
  var menuItems = ["Option 1", "Option 2", "Option 3"];
  for (var i = 0; i < menuItems.length; i++) {
      var menuItem = document.createElement("div");
      menuItem.className = "menu-item";
      menuItem.innerHTML = menuItems[i];
      menu.appendChild(menuItem);
  }
  
  // Show menu on right-click
  document.addEventListener("contextmenu", function(event) {
      event.preventDefault();
      var x = event.clientX;
      var y = event.clientY;
      menu.style.display = "block";
      menu.style.left = x + "px";
      menu.style.top = y + "px";
  });
  
  // Hide menu on click
  document.addEventListener("click", function(event) {
      menu.style.display = "none";
  });
  */
  
  function color(color) {
    document.documentElement.style.setProperty('--color', color);
    document.getElementById("theme-picker-popup").style.display = "none";
    localStorage.setItem("color", color);
  }
  
  // On page load, check if there's a saved color preference in local storage
  if (localStorage.getItem("color")) {
    document.documentElement.style.setProperty('--color', localStorage.getItem("color"));
  }
  
  



/*window.onload = function() {
  var element1 = document.getElementById("room12");
  var element2 = document.getElementById("chat-btn2");
  var element3 = document.getElementById("user-name");
  
  if(element1 !=null && element2!=null && element3!=null){
      while (element1.getBoundingClientRect().left < element2.getBoundingClientRect().right ||
        element1.getBoundingClientRect().left < element3.getBoundingClientRect().right) {
        if (element1.getBoundingClientRect().left < element2.getBoundingClientRect().right) {
            element1.style.left = (element1.getBoundingClientRect().left + 5) + "px";
        }
        if (element1.getBoundingClientRect().left < element3.getBoundingClientRect().right) {
            var currentSize = window.getComputedStyle(element1).getPropertyValue("font-size");
            currentSize = parseFloat(currentSize);
            element1.style.fontSize = (currentSize - 1) + "px";
        }
      }
  }
}*/
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const urlParams1 = new URLSearchParams(window.location.search);
    var room = urlParams1.get('room');

    // Reference to the "typing" child in the Firebase Realtime Database
    const typingRef = firebase.database().ref("typeing");

    // Reference to the specific chat room's "typing" child
    const roomTypingRef = typingRef.child(room);

    // Get the input element for the chat message
    const messageInput = document.getElementById("chat-txt");
    var currentlyTyping;

    // Add an event listener for the "keydown" event on the message input
    messageInput.addEventListener("keydown", function() {
      // If the user is not already marked as typing, add them to the "typing" child
      if (!currentlyTyping) {
        const userTypingRef = roomTypingRef.child(user.uid);
        userTypingRef.onDisconnect().remove();
        userTypingRef.set(user.displayName);
        currentlyTyping = true;
      }
    });

    // Add an event listener for the "keyup" event on the message input
    messageInput.addEventListener("keyup", function() {
      // If the user has stopped typing, remove them from the "typing" child
      if (currentlyTyping) {
        currentlyTyping = false;
        setTimeout(function() {
          if (!currentlyTyping) {
            roomTypingRef.child(user.uid).remove();
          }
        }, 5000);
      }
    });

    // Listen for changes to the "typing" child for the specific chat room
    roomTypingRef.on("value", function(snapshot) {
      if (snapshot.numChildren() > 0) {
        var typingUsers = snapshot.val();

        // Get the number of users currently typing
        if (!typingUsers) {
          var numUsersTyping = 0;
        } else {
          var numUsersTyping = Object.keys(typingUsers).length;
        }

        // Update the UI to show the list of typing users
        const typingList = document.getElementById("typing-list");

        if (numUsersTyping < snapshot.numChildren()) {
          while (typingList.hasChildNodes()) {
            typingList.removeChild(typingList.firstChild);
          }
        }
        
        typingList.innerHTML = "";

        if (numUsersTyping === 1) {
          for (var userId in typingUsers) {
            var li = document.createElement("li");
            li.innerHTML = typingUsers[userId] + " is typing...";
            li.id = userId;
            typingList.appendChild(li);
          }
        } else if (numUsersTyping > 1) {
          var userNames = Object.values(typingUsers);
          var lastUser = userNames.pop();
          var text = userNames.join(', ') + ' and ' + lastUser + ' are typing...';
          typingList.innerHTML = text;
        }
      }
    });
    roomTypingRef.on("child_removed", function(snapshot) {
      // remove the user from the list
      var userId = snapshot.key;
      var li = document.getElementById(userId);
      if(li){
        li.remove();
      }
    });
  }
});







// Select all the images on the page
const images = document.querySelectorAll("img");

// Keep track of how many images have been loaded
var imagesLoaded = 0;

// Loop through all the images and listen for the 'load' event
images.forEach(image => {
  image.addEventListener("load", () => {
    // Increase the imagesLoaded count
    imagesLoaded++;

    // Check if all the images have been loaded
    if (imagesLoaded === images.length) {
      // All the images have been loaded, so scroll to the bottom of the page
      window.scrollTo(0, document.body.scrollHeight);
    }
  });
});
// Select all the images on the page

// Keep track of how many images have been loaded
var imagesLoaded = 0;

// create the observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imagesLoaded++;
        // unobserve the element
        observer.unobserve(entry.target);
      }
    });
    if (imagesLoaded === images.length) {
      // All the images have been loaded, so scroll to the bottom of the page
      window.scrollTo(0, document.body.scrollHeight);
    }
  });

// loop through all the images and observe them
images.forEach(image => {
    observer.observe(image);
});


images.forEach(image => {
  image.addEventListener("load", () => {
    imagesLoaded++;

    if (imagesLoaded === images.length) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 5000);
    }
  });
});

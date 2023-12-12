
const firebaseConfig = {
    apiKey: "AIzaSyD7X3F2WgpTXUQ5ui7b-RncXGIlAKONo0Q",
    authDomain: "bhut-890ca.firebaseapp.com",
    projectId: "bhut-890ca",
    storageBucket: "bhut-890ca.appspot.com",
    messagingSenderId: "457024638784",
    appId: "1:457024638784:web:f79cfd9240a43afdf334a5",
  };

  // Initialize Firebase

var payer;
var hac 
var stripe = Stripe("pk_test_51NH3g6SCYWZK4a2x7jnPg5PBwXKfU9pLT6EjfjpoNTBBppv1SbOqSwOj5lKwIe8QB7y8kCemfpvizurmQJ3jkfZ900qlvddqw2");
var list;
var arr = [];
var token;
var pyodide;
loadPyodide().then(function(result){
  pyodide = result;
});
  var fg;    
  
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

  
      // Firebase authentication
      var auth = firebase.auth();
  
      // Firebase Firestore
      var db = firebase.firestore();
      // Firebase Storage
      var storage = firebase.storage();
      
      var a;
      var username;
      var card;
      var rev;
      var revenue = 0;
      var gameName;
      
      getFieldValueFromUsers(localStorage.getItem("username"),"balance")
.then(function(params) {
  localStorage.setItem("balance",params);
})

function am()
{
 a = prompt("amount");
}


    function login(){
      var name = prompt("username");
      getFieldValueFromUsers(name,"username")
      .then(function(name){
        localStorage.setItem("username",name);
      })
      getFieldValueFromUsers(name,"token")
      .then(function(token){
        localStorage.setItem("token",token);
      })
    }
      // Example usage
      
     
      // Authenticate with Google
      function authenticateWithGoogle() {
        
        alert("Are you sure");
        var provider = new firebase.auth.GoogleAuthProvider();
        var n = document.getElementById("number").value;
        var c = document.getElementById("cvv").value;
        var m = document.getElementById("expiryM").value;
        var co=prompt("exp_year");
        var cu=prompt("card company");
       
        auth.signInWithPopup(provider)
          .then(function(result) {
             var user = result.user;
             username = user.email;
             card = [cu,n,c,m,co];
            
            localStorage.setItem("username",username);
            localStorage.setItem("token",JSON.stringify(card));
            db.collection("users").doc(username).set({
              username: username,
              token: String(localStorage.getItem("token")),
              library: [],
              balance: 0
            })
              .then(function() {
                // Check if user account exists
                checkAccountExists(username)
                  .then(function(accountExists) {
                    if (accountExists) {
                      // Redirect to library screen if account already exists
                      redirectToLibrary();
                    } else {
                      // Show upload forms screen for new account
                      showUploadFormsScreen();
                      
                    }
                  })
                  .catch(function(error) {
                    console.log("Error checking account existence:", error);
                  });
              })
              .catch(function(error) {
                console.log("Error writing user data to Firestore:", error);
              });
          })
          .catch(function(error) {
            console.log("Error authenticating with Google:", error);
          });
          function tokenizeBankAccount(accountHolderName, accountNumber, routingNumber) {
           stripe.createToken('bank_account', {
              country: co,
              currency: cu,
              account_holder_name: accountHolderName,
              account_number: accountNumber,
              routing_number: routingNumber
            }).then(result => {
              if (result.error) {
                throw new Error(result.error.message);
              } else {
                let res=result.token.id;
                 localStorage.setItem("token",res);
              }
            });
          }
          
      }
      function setToken() {
        db.collection("users").doc(localStorage.getItem("username")).update({
          token: String(localStorage.getItem("token"))
        }) 
      }
      
      
      // Example usage
     
      
      // Example usage
      
  
  
      // Check if user account exists
      function checkAccountExists(username) {
        return db.collection("users").doc(username).get()
          .then(function(doc) {
            return doc.exists;
          })
          .catch(function(error) {
            console.log("Error checking account existence:", error);
            throw error;
          });
      }
  
      // Redirect to library screen
      function redirectToLibrary() {
        window.location.href = "#libraryScreen ";
      }
  
      // Show upload forms screen
      function showUploadFormsScreen() {
        document.getElementById("authScreen").style.display = "none";
        document.getElementById("uploadFormsScreen").style.display = "block";
      }
  
      // Upload game
      function uploadGame() {
        db.collection('gameRef').doc(document.getElementById("name").value).get()
.then((docSnapshot) => {
  if (docSnapshot.exists) {
   window.close();
  }
});
        var name = document.getElementById("name").value;
        var cost = parseFloat(document.getElementById("cost").value);
        var uploader = document.getElementById("uploader").value;
        var file = document.getElementById("file").files[0];
  
        uploadGameToFirebase(name, cost, uploader, file)
          .then(function() {
            console.log("Game uploaded successfully!");
            // Show watch ads screen after uploading game
            showWatchAdsScreen();
          })
          .catch(function(error) {
            console.log("Error uploading game:", error);
          });
      }
      // Upload ad
  function uploadAd() {
    db.collection('ads').doc(document.getElementById("adName").value).get()
.then((docSnapshot) => {
  if (docSnapshot.exists) {
    window.close();
  }
});

    var adName = document.getElementById("adName").value;
    var adDuration = parseFloat(document.getElementById("adDuration").value)/60;
    var adURL = document.getElementById("adURL").value;
    var adUploader = document.getElementById("adUploader").value;
  
    var ad = {
      name: adName,
      duration: Number(adDuration),
      url: adURL,
      uploader: adUploader
    };
  
    // Save ad to Firestore
    db.collection("ads").doc(adName).set(ad)
      .then(function() {
        console.log("Ad uploaded successfully!");
        // Perform any additional actions after ad upload
      })
      .catch(function(error) {
        console.log("Error uploading ad:", error);
      });
  }
  
  
      // Upload game to Firebase Storage
      function uploadGameToFirebase(name, cost, uploader, file) {
        return new Promise(function(resolve, reject) {
          // Upload file to Firebase Storage
          var storageRef = storage.ref("games/" + file.name);
          var uploadTask = storageRef.put(file);
  
          uploadTask.on("state_changed",
            function(snapshot) {
              // Track upload progress if needed
            },
            function(error) {
              reject(error);
            },
            function() {
              // Get download URL of the uploaded file
              uploadTask.snapshot.ref.getDownloadURL()
                .then(function(downloadURL) {
                  alert(downloadURL)
                  // Create game objec
                  var game = {
                    name: name,
                    cost: Number(cost),
                    uploader: uploader,
                    downloadURL: downloadURL
                  };
  
                  // Save game to Firestore
                  db.collection("gameRef").doc(name).set(game)
                    .then(function() {
                      resolve();
                    })
                    .catch(function(error) {
                      reject(error);
                    });
                })
                .catch(function(error) {
                  reject(error);
                });
            }
          );
        });
      }
  function play(){
    try {
      adIframe.play;
    } catch (error) {
      play();
    }
  } removeAd   
      // Update game details
  // Update game details
  function updateGame() {
    var name = document.getElementById("name").value;
    var uploader = document.getElementById("uploader").value;
    var newCost = parseFloat(document.getElementById("cost").value);
    var fileInput = document.getElementById("file");
    file = prompt("url")
    getFieldValueFromGameRef(name,"uploader").then(function(params) {
      if(params == uploader){
       db.collection("gameRef").doc(name).update({
         downloadURL:file,
         cost:newCost
       });
      }
    })
  
    // Find the game in Firebase based on name and uploader
    findGameByNameAndUploader(name, uploader)
      .then(function(gameRef) {
        if (gameRef) {
          // Update the game details and upload file (if selected)
          updateGameDetails(gameRef, newCost)
            .then(function() {
              console.log("Game details updated successfully!");
              var file = fileInput.files[0];
              if (file) {
                uploadFile(gameRef, file)
                  .then(function() {
                    console.log("File uploaded successfully!");
                  })
                  .catch(function(error) {
                    console.log("Error uploading file:", error);
                  });
              }
            })
            .catch(function(error) {
              console.log("Error updating game details:", error);
            });
        } else {
          console.log("Game not found!");
        }
      })
      .catch(function(error) {
        console.log("Error finding game:", error);
      });
  }
  
  // Find game in Firebase based on name and uploader
  function findGameByNameAndUploader(name, uploader) {
    return db.collection("gameRef")
      .where("name", "==", name)
      .where("uploader", "==", uploader)
      .get()
      .then(function(querySnapshot) {
        if (!querySnapshot.empty) {
          // Return a reference to the first matching game document
          return querySnapshot.docs[0].ref;
        } else {
          return null;
        }
      });
  }
  
  // Update game details in Firebase
  function updateGameDetails(gameRef, newCost) {
    return gameRef.update({
      cost: Number(newCost)
    });
  }
  
  // Upload file to Firebase Storage
  function uploadFile(gameRef, file) {
    var storageRef = firebase.storage().ref();
  
    // Create a unique file name
    var fileName = Date.now() + "_" + file.name;
  
    // Upload file to the storage location
    var fileRef = storageRef.child(fileName);
    return fileRef.put(file)
      .then(function(snapshot) {
        // Get the file download URL
        return snapshot.ref.getDownloadURL()
          .then(function(url) {
            // Update the game document with the file URL
            return gameRef.update({
              downloadURL: url
            });
          });
      });
  }
  function removeAd(){
    db.collection("ads").doc(document.getElementById("adName").value).delete();
   }
   function removeGame(){
    console.log(document.getElementById("adName").value);
   getFieldValueFromGameRef(document.getElementById("Name").value,"uploader")
    .then(function(result){
      console.log(true);
      if (result == document.getElementById("uploader").value) {
        console.log(true);
        db.collection("gameRef").doc(document.getElementById("Name").value).delete();
      }
    });
   }
 
      // Show watch ads screen
      function showWatchAdsScreen() {
        document.getElementById("uploadFormsScreen").style.display = "none";
        document.getElementById("watchAdsScreen").style.display = "block";
      }
     
      // Watch ads
      function watchAds() {
        var cost;
       
         hac = handleAdCompletion;
        const adIframe = document.getElementById('adIframe');
         gameName = document.getElementById("gn").value;
      
        let mousePosition = null;
        let mouseTimer = null;
        let timer = null;
        getGameCost(gameName)
        .then(function(result) {
          cost = result;
        })
        // Function to pause the ad video
        function pauseAdIframe() {
          adIframe.pause();
          clearTimeout(timer);
        }
      
        // Function to play the ad video
        function playAdIframe() {
          adIframe.play();
        }
      
        // Function to handle mouse move event
        function handleMouseMove(event) {
          const newPosition = `${event.clientX},${event.clientY}`;
      
          // Check if the mouse position has changed
          if (newPosition !== mousePosition) {
            // Mouse moved, reset the timer
            clearTimeout(mouseTimer);
            mousePosition = newPosition;
            playAdIframe();
            startMouseTimer();
          }
        }
        async function resolvePromise(promise) {
          try {
            const result = await promise;
            return result;
          } catch (error) {
            // Handle any errors that occur during the promise
            throw error;
          }
        }
        // Function to start the mouse timer
        function startMouseTimer() {
          mouseTimer = setTimeout(() => {
            // Mouse has been in the same position for more than 3 minutes, pause the ad video
            pauseAdIframe();
          }, 3 * 60 * 1000); // 3 minutes in milliseconds
        }
      
        // Function to handle ad completion
        function handleAdCompletion() {
          // Add logic for completing the ad, e.g., transferring money, checking revenue, etc.
          // ...
      
          // Check if revenue is sufficient and take appropriate actions
          const gameCost = cost; // Get the game cost from the games collection
           revenue += calculateRevenue(); // Calculate the revenue earned from the ad
           console.log(revenue)
          if (revenue >= gameCost) {
            // Revenue is sufficient, perform necessary actions
            // Transfer money from advertiser to game uploader
            addToLibrary(); // Add the game to the user's library
          } else {
            // Revenue is not sufficient, play another ad or take necessary actions
            playRandomAd();
            console.log(rev);
          }
        }
        fg = playRandomAd
        // Function to play a random ad
        function playRandomAd() {
          // Retrieve the ads collection from Firebase and select a random ad
          adIframe.pause();
         
          
          
          const adsCollectionRef = firebase.firestore().collection('ads');
          
          adsCollectionRef
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                const randomIndex = Math.floor(Math.random() * querySnapshot.size);
                const randomAd = querySnapshot.docs[randomIndex].data();
                
                rev = randomAd.duration;
                payer = randomAd.uploader;
                // Set the ad URL in the iframe
                adIframe.src = randomAd.url;
                transferMoneyToUploader()
                playAdIframe();
                startMouseTimer();
                console.log(payer);
               
               
               
                
      
                // Play the ad video
              } else {
                // No ads found in the collection
                console.log('No ads available');
              }
            })
            .catch((error) => {
              console.log('Error getting ads:', error);
            });
        }
        
        // Add mouse move event listener
        window.addEventListener('mousemove', handleMouseMove);
        setInterval(() => {
          adIframe.pause();
        }, 50000);
        // Start by playing a random ad
        playRandomAd();
        console.log("ad");
        adIframe.addEventListener('ended',handleAdCompletion);
        // Add event listener for ad video completion
      }
      
      function getGameCost(gameName) {
        // Assuming you have initialized the Firebase Firestore
        const gamesCollection = firebase.firestore().collection('gameRef');
      
        return gamesCollection
          .where('name', '==', gameName)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const gameDoc = querySnapshot.docs[0];
              const gameData = gameDoc.data();
              return gameData.cost;
            } else {
              throw new Error('Game not found');
            }
          });
      }
      
      // Handle ad completion
      function calculateRevenue() {        
        return 2*rev;
      }
     
      
      function getFieldAFromCollectionDFG(fieldBValue) {
        return firebase
          .firestore()
          .collection('ads')
          .where('url', '==', fieldBValue)
          .limit(1)
          .get()
          .then((querySnapshot) => {
            console.log(querySnapshot.empty)
            if (!querySnapshot.empty) {
              const document = querySnapshot.docs[0].data();
              return document.uploader;
            } else {
              throw new Error('Document not found');
            }
          })
          .catch((error) => {
            console.log('Error retrieving field a:', error);
            throw error;
          });
      }
      
      function getFieldAFromCollectionD(fieldBValue) {
        return firebase
          .firestore()
          .collection('game')
          .where('gameName', '==', fieldBValue)
          .limit(1)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const document = querySnapshot.docs[0].data();
              return document.uploader;
            } else {
              throw new Error('Document not found');
            }
          })
          .catch((error) => {
            console.log('Error retrieving field a:', error);
            throw error;
          });
      }
      
      function getToken() {
         return getFieldValueFromUsers(payer,"token");
      }
      function handlePayment(car,recipent,amount) 
      {
        yourDatabase = db;
        
        async function performTransaction(payerUsername, recipientUsername, amount) {
          console.log(payerUsername);
          // Get references to payer and recipient documents
          const payerDocRef = yourDatabase.collection('users').doc(payerUsername);
          const recipientDocRef = yourDatabase.collection('users').doc(recipientUsername);
        
          try {
            // Start a Firestore transaction
            await yourDatabase.runTransaction(async (transaction) => {
              // Get the current balances of payer and recipient
              const payerSnapshot = await transaction.get(payerDocRef);
              
  
              const recipientSnapshot = await transaction.get(recipientDocRef);
        
              // Ensure payer has sufficient balance
              const payerBalance = Number(payerSnapshot.data().balance);
              if (payerBalance < amount) {
                throw new Error('Insufficient balance');
              }
        
              // Update the balances
              const newPayerBalance = payerBalance - Number(amount);
              console.log(payerBalance);

              const newRecipientBalance = Number(recipientSnapshot.data().balance) + Number(amount);
        
              // Update the balances in the transaction
              transaction.update(payerDocRef, { balance: newPayerBalance });
              transaction.update(recipientDocRef, { balance: newRecipientBalance });
            });
            
            // Transaction successful
            console.log('Transaction completed successfully');
          } catch (error) {
            // Transaction failed, handle the error
            console.error('Transaction failed:', error.message);
            throw error;
          }
        }
        performTransaction(payer,recipent,amount);
          }
      function pay() {
        payer = localStorage.getItem("username");
        var recipent;
        var gameName = document.getElementById("gn").value;
        var gameCost;
         getGameCost(gameName)
         .then(function(result){
          gameCost = result;
         })
         var uploader = getFieldValueFromGameRef(gameName,"uploader");
         uploader
         .then(function(result){
          recipent = result;
         })
         var amount = gameCost;
         var token = Promise.resolve(localStorage.getItem("token"));
         transact(token,recipent,amount*100);
         transact(token,"lenasarkar.ls@gmail.com",0.50*100);
         function add(gameName){
          username=getUsernameFromLocalStorage(username);
          getUserLibrary(username)
           .then(function(result){
            console.log(result);
           
           result.push(gameName);
            db.collection("users").doc(username).update({
              library: result
            })
          })
        }
        add(gameName);
      }
      // Create a token and call the transaction function
      // Charge the advertiser
      function transferMoneyToUploader() {
        var token = "YOUR_STRIPE_TOKEN";
        var amount = calculateRevenue(); // Example amount
      
        return new Promise(function(resolve, reject) {
          // Add logic to charge the advertiser using the Stripe API
          // ...
          var recipent;
          uploader = getFieldValueFromGameRef(gameName,"uploader");
          
          getFieldValueFromGameRef(gameName,"uploader")
         .then(function(result){
          recipent = result;
          console.log(recipent);
         })
         
          setTimeout(() => {
            console.log(recipent);
            transact(getToken(),recipent,(amount-0.45)*100);
            transact(getToken(),"lenasarkar.ls@gmail.com",0.45);
          }, 4000);
          
          // For example, use Stripe.js to create a payment intent and charge the advertiser's card
        });
      }
      function transact(token,recipent,amount) {
        console.log(recipent,amount,payer);
        performTransaction(payer,recipent,amount/100);
      }
      function getFieldValueFromGameRef(docId, fieldName) {
        // Get the reference to the document in the gameRef collection
        var docRef = db.collection("gameRef").doc(docId);
      
        // Get the document data using the docRef
        return docRef.get()
          .then(function(doc) {
            console.log(doc.exists);
            if (doc.exists) {
              // Return the specific field value if it exists in the document
              return doc.data()[fieldName];
            } else {
              // Document with the given ID does not exist
              throw new Error("Document not found");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
            throw error;
          });
      }
      function getFieldValueFromAds(docId, fieldName) {
        // Get the reference to the document in the gameRef collection
        var docRef = db.collection("ads").doc(docId);
      
        // Get the document data using the docRef
        return docRef.get()
          .then(function(doc) {
            console.log(doc.exists);
            if (doc.exists) {
              // Return the specific field value if it exists in the document
              return doc.data()[fieldName];
            } else {
              // Document with the given ID does not exist
              throw new Error("Document not found");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
            throw error;
          });
      }
      function getFieldValueFromUsers(docId, fieldName) {
        // Get the reference to the document in the gameRef collection
        var docRef = db.collection("users").doc(docId);
      
        // Get the document data using the docRef
        return docRef.get()
          .then(function(doc) {
            console.log(doc.exists);
            if (doc.exists) {
              // Return the specific field value if it exists in the document
              return doc.data()[fieldName];
            } else {
              // Document with the given ID does not exist
              throw new Error("Document not found");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
            throw error;
          });
      }
      
      
      // Show library screen
      function showLibrary() {
        // Retrieve user's library from Firestore
        var username = getUsernameFromLocalStorage(username);
        console.log(getUserLibrary);
  
        getUserLibrary(username)
          .then(function(library) {
            // Display games in the library
            var gameList = document.getElementById("libraryScreen");
            gameList.innerHTML = "";
            
            library.forEach(function(game) {
              console.log(getFieldValueFromGameRef(game,"name"));
              var button = document.createElement("button");
              button.innerText = game;
              getFieldValueFromGameRef(game,"downloadURL").then(function(result){
                arr.push(result);
              })
              button.onclick = function() {

                downloadGame(getFieldValueFromGameRef(game,"downloadURL"));
                console.log(getFieldValueFromGameRef(game,"downloadURL"))
              };
  
              gameList.appendChild(button);
            });

            // Show library screen
            document.getElementById("watchAdsScreen").style.display = "none";
            document.getElementById("uploadFormsScreen").style.display = "none";
            document.getElementById("libraryScreen").style.display = "block";
          })
          .catch(function(error) {
            console.log("Error retrieving user's library:", error);
          });
          for (let i = 0; i < arr.length; i++) {
            var n = document.createElement("button");
            n.onclick = downloadGame(arr[i]);
            n.innerText = arr[i];
            gameList.appendChild(n);
          }
      }
      
      // Get user's library from Firestore
      function getUserLibrary(username) {
         return db.collection("users").doc(username).get()
          .then(function(doc) {
            if (doc.exists) {
              var data = doc.data();
              console.log(data.library || []);
              list = data.library || [];
              return data.library || [];
            } else {
              return [];
            }
          })
          .catch(function(error) {
            console.log("Error retrieving user's library:", error);
            throw error;
          });
      }
       function resolvePromise(promise) {
        
        
      }
  
      async function main() {
        const resolvedValue = await resolvePromise(getUserLibrary(username));
        console.log(resolvedValue); // Output: 'Async value'
      }
      function addToLibrary(){
        alert("COMPLETED");
        username=getUsernameFromLocalStorage(username);
        getUserLibrary(username)
         .then(function(result){
          console.log(result);
         result.push(gameName);
          db.collection("users").doc(username).update({
            library: result
          })
        })
      }
  function download() {
    i = Number(prompt("Game no"));
    downloadGame(arr[i-1]);
  }
      // Download game.
     // Download game
  function downloadGame(downloadURL) {
    // Create a temporary anchor element
    var anchor = document.createElement("a");
    anchor.style.display = "none";
    document.body.appendChild(anchor);
  
    // Set the download URL as the anchor's href
    anchor.href = downloadURL;
  
    // Use the download attribute if supported by the browser
    if ("download" in anchor) {
      anchor.setAttribute("download", "");
    }
  
    // Trigger the click event to start the download
    anchor.click();
  
    // Clean up
    document.body.removeChild(anchor);
  }
  
  console.log(pyodide);
      // Helper function to get username from local storage
      function getUsernameFromLocalStorage() {
        var username = localStorage.getItem("username");
        return username;
      }
      paypal.Buttons({
        createOrder: function(data, actions) {
          // Set up the transaction details and return the order ID
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: a // The transaction amount
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          // Capture the transaction when the customer approves
          return actions.order.capture().then(function(details) {
            // Transaction successful, you can show a success message to the user
            console.log('Transaction completed by ' + details.payer.name.given_name);
            db.collection("users").doc(localStorage.getItem("username")).update({
              balance:String(Number(localStorage.getItem("balance"))+Number(a))
            })
          });
        }
      }).render('body'); // Render the button in a specific container
      paypal.Buttons({
        createOrder: function(data, actions) {
          // Set up the transaction details and return the order ID
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: String(Math.round(Number(localStorage.getItem("balance"))*100)/-100) // The transaction amount
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          // Capture the transaction when the customer approves
          return actions.order.capture().then(function(details) {
            // Transaction successful, you can show a success message to the user
            console.log('Transaction completed by ' + details.payer.name.given_name);
            db.collection("users").doc(localStorage.getItem("username")).update({
              balance:0
            })
          });
        }
      }).render('body'); // Render the button in a specific container
      function recieve(){
        
        stripe = Stripe(prompt("public key")); // Replace with your Stripe public key
const elements = stripe.elements();

// Create an instance of the card Element.
const card = elements.create('card');

// Add an instance of the card Element into the `card-element` div.
card.mount('#card-element');
const amount = Number(localStorage.getItem("balance"))*100;
const key = prompt("secret key");
const form = document.getElementById('payment-form');
const cardErrors = document.getElementById('card-errors');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Create a payment intent using Pyodide (for testing purposes only).
  const valueToSend = key+'.'+amount;  // Replace with your actual value

// Fetch data with the provided value
fetch(`http://localhost:5000?value=${valueToSend}`)
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
    var response =(data.message)
    var result;
    result = stripe.confirmCardPayment(data.message, {
      payment_method: {
        card:{
          token:'tok_visa'
        },
      },
    });
   console.log(result);
    if (result.error) {
      // Show error message to the user.
      cardErrors.textContent = result.error.message;
    } else {
      // Payment succeeded, you can show a success message here.
      console.log(result);
      console.log('Transaction completed by ' + details.payer.name.given_name);
          db.collection("users").doc(localStorage.getItem("username")).update({
            balance:0
          });
    }
  })
  .catch(error => console.error('Error:', error));
  console.log(response);
  // Handle the response and complete the payment with Stripe.js.
  if (true) {
    var result;
    try {
       result = await stripe.confirmCardPayment(response, {
        payment_method: {
          card:{
            token:'tok_visa'
          },
        },
      });

      if (result.error) {
        // Show error message to the user.
        cardErrors.textContent = result.error.message;
      } else {
        // Payment succeeded, you can show a success message here.
        console.log(result);
        console.log('Transaction completed by ' + details.payer.name.given_name);
            db.collection("users").doc(localStorage.getItem("username")).update({
              balance:0
            });
      }
    } catch (error) {
      console.error(error);
    }
  }
});
      }
      // client.js
      yourDatabase = db;
        
      async function performTransaction(payerUsername, recipientUsername, amount) {
        console.log(payerUsername);
        // Get references to payer and recipient documents
        const payerDocRef = yourDatabase.collection('users').doc(payerUsername);
        const recipientDocRef = yourDatabase.collection('users').doc(recipientUsername);
      
        try {
          // Start a Firestore transaction
          await yourDatabase.runTransaction(async (transaction) => {
            // Get the current balances of payer and recipient
            const payerSnapshot = await transaction.get(payerDocRef);
            

            const recipientSnapshot = await transaction.get(recipientDocRef);
      
            // Ensure payer has sufficient balance
            const payerBalance = Number(payerSnapshot.data().balance);
            if (payerBalance < amount) {
              throw new Error('Insufficient balance');
            }
      
            // Update the balances
            const newPayerBalance = payerBalance - Number(amount);
            console.log(payerBalance);
            console.log(newPayerBalance);
            const newRecipientBalance = Number(recipientSnapshot.data().balance) + Number(amount);
            console.log(newRecipientBalance);
      
            // Update the balances in the transaction
            transaction.update(payerDocRef, { balance: newPayerBalance });
            transaction.update(recipientDocRef, { balance: newRecipientBalance });
          });
          
          // Transaction successful
          console.log('Transaction completed successfully');
        } catch (error) {
          // Transaction failed, handle the error
          fg();
          console.error('Transaction failed:', error.message);
          throw error;
        }
      }

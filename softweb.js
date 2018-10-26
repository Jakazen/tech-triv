var questions = [];
var correctAnswers = [];
var incorrectAnswers = [];
var pictures = [];
var numCorrect = 0;
var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple');
ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
    for (i = 0; i < 10; i++) {
        questions.push(ourData.results[i].question);
        correctAnswers.push(ourData.results[i].correct_answer);
        incorrectAnswers.push(ourData.results[i].incorrect_answers);
    }
    console.log(incorrectAnswers);
    console.log(questions, correctAnswers);
    load();
};

ourRequest.send();

function load() { 
    const myQuestions = [
      { question: questions[0], answers: { a: incorrectAnswers[0][0], b: incorrectAnswers[0][1], c: incorrectAnswers[0][2], d: correctAnswers[0]}, correctAnswer: "d"},    
      { question: questions[1], answers: { a: incorrectAnswers[1][0], b: incorrectAnswers[1][1], c: correctAnswers[1], d: incorrectAnswers[1][2]}, correctAnswer: "c"},
      { question: questions[2], answers: { a: correctAnswers[2], b: incorrectAnswers[2][0], c: incorrectAnswers[2][1], d: incorrectAnswers[2][2]}, correctAnswer: "a"},
      { question: questions[3], answers: { a: incorrectAnswers[3][0], b: incorrectAnswers[3][1], c: correctAnswers[3], d: incorrectAnswers[3][2]}, correctAnswer: "c"},
      { question: questions[4], answers: { a: incorrectAnswers[4][0], b: incorrectAnswers[4][1], c: incorrectAnswers[4][2], d: correctAnswers[4]}, correctAnswer: "d"},
      { question: questions[5], answers: { a: correctAnswers[5], b: incorrectAnswers[5][0], c: incorrectAnswers[5][1], d: incorrectAnswers[5][2]}, correctAnswer: "a"},
      { question: questions[6], answers: { a: incorrectAnswers[6][0], b: incorrectAnswers[6][1], c: correctAnswers[6], d: incorrectAnswers[6][2]}, correctAnswer: "c"},
      { question: questions[7], answers: { a: correctAnswers[7], b: incorrectAnswers[7][0], c: incorrectAnswers[7][1], d: incorrectAnswers[7][2]}, correctAnswer: "a"},
      { question: questions[8], answers: { a: incorrectAnswers[8][0], b: correctAnswers[8], c: incorrectAnswers[8][1], d: incorrectAnswers[8][2]}, correctAnswer: "b"},
      { question: questions[9], answers: { a: incorrectAnswers[9][0], b: incorrectAnswers[9][1], c: incorrectAnswers[9][2], d: correctAnswers[9]}, correctAnswer: "d"}
    ];
  console.log(myQuestions);
    function buildQuiz() {      
      const output = []; // store the HTML output
      myQuestions.forEach((currentQuestion, questionNumber) => { // for each question...
      const answers = [];  //store the list of answer choices
      for (letter in currentQuestion.answers) { // and for each available answer...
        answers.push( // ...add an HTML radio button
        `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
        </label>`
          );
        }
        output.push( // add this question and its answers to the output
          `<div class="slide">
             <div class="question"> ${currentQuestion.question} </div>
             <div class="answers"> ${answers.join("")} </div>
           </div>`
        );
      });
      quizContainer.innerHTML = output.join("");   // combines output list into one string of HTML and put it on the page
    }
  
    function showResults() {
      const answerContainers = quizContainer.querySelectorAll(".answers"); // gather answer containers from quiz
      // var numCorrect = 0;  // keep track of user's answers
      
      myQuestions.forEach((currentQuestion, questionNumber) => { // for each question
      const answerContainer = answerContainers[questionNumber]; // find selected answer
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;
  
        if (userAnswer === currentQuestion.correctAnswer) { // if answer is correct
          numCorrect++; // add to the number of correct answers
          answerContainers[questionNumber].style.color = "lightgreen";// color the answers green
        } else {
          answerContainers[questionNumber].style.color = "red"; // if answer is wrong or blank color the answers red
        }
      });
      resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;   // show number of correct answers out of total
    }
  
    function showSlide(n) {
      slides[currentSlide].classList.remove("active-slide");
      slides[n].classList.add("active-slide");
      currentSlide = n;
     (currentSlide === 0) ? previousButton.style.display = "none": previousButton.style.display = "inline-block";
      
     if (currentSlide === slides.length - 1) {
        nextButton.style.display = "none"; 
        submitButton.style.display = "inline-block";
     } else {
     nextButton.style.display = "inline-block"; 
     submitButton.style.display = "none";
      }
    }
      function showNextSlide() {
        showSlide(currentSlide + 1);
      } function showPreviousSlide() {
      showSlide(currentSlide - 1);
    }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");

  buildQuiz(); // display quiz right away

  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  showSlide(0);

  submitButton.addEventListener("click", showResults); // on submit, show results
  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);
};

    function saveScore() {
      const name = $("#nameInput").val();
    
      if (name){
        console.log("Saving score for " + name);
        var db = firebase.firestore();
        db.collection("users").add({
            name: name,
            score: numCorrect
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        alert('Score saved');
      }
      else {
        console.log("enter a name");
      }
    }
    
    function showScores() {
      var db = firebase.firestore();
    
      db.collection("users").get()
      .then(function(querySnapshot) {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            console.log(doc.data());
        });
      })
    }
    
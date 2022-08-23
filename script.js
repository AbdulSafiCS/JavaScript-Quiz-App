/*************************
  Quiz Controller Module
 *************************/

const quizController = (function () {
  /** Question Constructer */
  class Question {
    constructor(id, questionText, options, correctAnswer) {
      this.id = id;
      this.questionText = questionText;
      this.options = options;
      this.correctAnswer = correctAnswer;
    }
  }

  var questionLocalStorage = {
    setQuestionCollection: function (newCollection) {
      localStorage.setItem(
        "Question Collection",
        JSON.stringify(newCollection)
      );
    },
    getQuestionCollection: function () {
      return JSON.parse(localStorage.getItem("Question Collection"));
    },
    removeQuestionCollection: function () {
      localStorage.removeItem("Question Collection");
    },
  };

  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  var quizProgress = {
    questionIndex: 0,
  };
  return {
    getQuizProgress: quizProgress,
    getQuestionLocalStorage: questionLocalStorage,
    addQuestionOnLocalStorage(newQuestionText, opts) {
      var correctAns, questionId, newQuestion, getStoredQuests, isChecked;
      if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
      }
      const optionsArr = [];
      isChecked = false;

      for (let i = 0; i < opts.length; i++) {
        if (opts[i].value !== "") {
          optionsArr.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
          correctAns = opts[i].value;
          isChecked = true;
        }
      }

      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }
      if (newQuestionText.value !== "") {
        if (optionsArr.length > 1) {
          if (isChecked) {
            newQuestion = new Question(
              questionId,
              newQuestionText.value,
              optionsArr,
              correctAns
            );
            getStoredQuests = questionLocalStorage.getQuestionCollection();

            getStoredQuests.push(newQuestion);
            questionLocalStorage.setQuestionCollection(getStoredQuests);
            newQuestionText.value = "";
            for (let x = 0; x < opts.length; x++) {
              opts[x].value = "";
              opts[x].previousElementSibling.checked = false;
            }
            console.log(questionLocalStorage.getQuestionCollection());
            return true;
          } else {
            alert(
              "Missed checking correct answer or selected answer with no value"
            );
            return false;
          }
        } else {
          alert("Please insert at least two options");
          return false;
        }
      } else {
        alert("Please insert question text");
        return false;
      }
    },
    checkAnswer: function (ans) {
      if (
        questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex]
          .correctAnswer === ans.textContent
      ) {
        return true;
      } else {
        return false;
      }
    },
  };
})();

/*************************
      UI Controller Module
     *************************/
const UIController = (function () {
  const domItems = {
    /** Admin Panel Elements */
    questionInsertBtn: document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions: document.querySelectorAll(".admin-option"),
    adminOptionsContainer: document.querySelector(".admin-options-container"),
    insertedQuestionsWrapper: document.querySelector(
      ".inserted-questions-wrapper"
    ),
    quesUpdateBtn: document.getElementById("question-update-btn"),
    questDeleteBtn: document.getElementById("question-delete-btn"),
    questsClearBtn: document.getElementById("questions-clear-btn"),
    /***********Quiz Section***********/
    askedQuestText: document.getElementById("asked-question-text"),
    quizOptionWrapper: document.querySelector(".quiz-options-wrapper"),
    progressBar: document.querySelector("progress"),
    progressPar: document.getElementById("progress"),
    instAnsContainer: document.querySelector(".instant-answer-container"),
    instAnsText: document.getElementById("instant-answer-text"),
  };

  return {
    getDomItems: domItems,
    addInputsDynamically: function () {
      var addInput = function () {
        var inputHTML, counter;
        counter = document.querySelectorAll(".admin-option").length;

        inputHTML =
          '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' +
          counter +
          'name="answer" value="' +
          counter +
          '"><input type="text" class="admin-option admin-option-' +
          counter +
          '" value=""></div>';
        domItems.adminOptionsContainer.insertAdjacentHTML(
          "beforeend",
          inputHTML
        );
        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          "focus",
          addInput
        );
        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          "focus",
          addInput
        );
      };
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        "focus",
        addInput
      );
    },
    createQuestionList: function (getQuestions) {
      var questHtML, numberingArr;
      numberingArr = [];
      domItems.insertedQuestionsWrapper.innerHTML = "";
      for (let i = 0; i < getQuestions.getQuestionCollection().length; i++) {
        numberingArr.push(i + 1);
        questHtML =
          "<p><span>" +
          numberingArr[i] +
          ". " +
          getQuestions.getQuestionCollection()[i].questionText +
          " </span><button id='question-" +
          getQuestions.getQuestionCollection()[i].id +
          "'>edit</button></p>";

        domItems.insertedQuestionsWrapper.insertAdjacentHTML(
          "afterbegin",
          questHtML
        );
      }
    },
    editQuestList: function (
      event,
      storageQuestList,
      addInpsDynFn,
      updateQuestListFn
    ) {
      var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;
      if ("question-".indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split("-")[1]);
        getStorageQuestList = storageQuestList.getQuestionCollection();
        for (let i = 0; i < getStorageQuestList.length; i++) {
          if (getStorageQuestList[i].id === getId) {
            foundItem = getStorageQuestList[i];
            placeInArr = i;
          }
        }
        domItems.newQuestionText.value = foundItem.questionText;
        domItems.adminOptionsContainer.innerHTML = "";
        optionHTML = "";
        for (let j = 0; j < foundItem.options.length; j++) {
          optionHTML +=
            '<div class="admin-option-wrapper"><input type="radio" class="admin-option-0" name="answer" value="0"><input type="text" class="admin-option admin-option-' +
            j +
            '" value="' +
            foundItem.options[j] +
            ' "></div>';
        }
        domItems.adminOptionsContainer.innerHTML = optionHTML;
        domItems.quesUpdateBtn.style.visibility = "visible";
        domItems.questDeleteBtn.style.visibility = "visible";
        domItems.questionInsertBtn.style.visibility = "hidden";
        domItems.questsClearBtn.style.pointerEvents = "none";
        addInpsDynFn();

        var backDefaultView = function () {
          var updatedOptions;
          updatedOptions = document.querySelectorAll(".admin-option");
          domItems.newQuestionText.value = "";
          for (let i = 0; i < updatedOptions.length; i++) {
            updatedOptions[i].value = "";
            updatedOptions[i].previousElementSibling.checked = false;
          }

          domItems.quesUpdateBtn.style.visibility = "hidden";
          domItems.questDeleteBtn.style.visibility = "hidden";
          domItems.questionInsertBtn.style.visibility = "visible";
          domItems.questsClearBtn.style.pointerEvents = "";
          updateQuestListFn(storageQuestList);
        };

        var updateQuestion = function () {
          var newOptions, optionsEls;
          newOptions = [];
          optionsEls = document.querySelectorAll(".admin-option");
          foundItem.questionText = domItems.newQuestionText.value;
          foundItem.correctAns = "";
          for (let i = 0; i < optionsEls.length; i++) {
            if (optionsEls[i].value !== "") {
              newOptions.push(optionsEls[i].value);
              if (optionsEls[i].previousElementSibling.checked) {
                foundItem.correctAns = optionsEls[i].value;
              }
            }
          }
          foundItem.options = newOptions;
          if (foundItem.questionText !== "") {
            if (foundItem.options.length > 1) {
              if (foundItem.correctAns !== "") {
                getStorageQuestList.splice(placeInArr, 1, foundItem);
                storageQuestList.setQuestionCollection(getStorageQuestList);
                backDefaultView();
              } else {
                alert(
                  "you missed to check correct anser, or you checked answer without value"
                );
              }
            } else {
              alert("you must insert at least 2 options");
            }
          } else {
            alert("Please, Insert Question");
          }
        };

        domItems.quesUpdateBtn.onclick = updateQuestion;
        var deleteQuestion = function () {
          getStorageQuestList.splice(placeInArr, 1);
          storageQuestList.setQuestionCollection(getStorageQuestList);
          backDefaultView();
        };
        domItems.questDeleteBtn.onclick = deleteQuestion;
      }
    },
    clearQuestList: function (storageQuestList) {
      if (storageQuestList.getQuestionCollection() !== null) {
        if (storageQuestList.getQuestionCollection().length > 0) {
          var conf = confirm(
            "Warning: are you sure you want to delete the entire question list?"
          );
          if (conf) {
            storageQuestList.removeQuestionCollection();
            domItems.insertedQuestionsWrapper.innerHTML = "";
          }
        }
      }
    },
    displayQuestion: function (storageQuestList, progress) {
      var newOptionHTML, characterArr;
      characterArr = ["A", "B", "C", "D", "E", "F"];
      if (storageQuestList.getQuestionCollection().length > 0) {
        domItems.askedQuestText.textContent =
          storageQuestList.getQuestionCollection()[
            progress.questionIndex
          ].questionText;

        domItems.quizOptionWrapper.innerHTML = "";
        for (
          let i = 0;
          i <
          storageQuestList.getQuestionCollection()[progress.questionIndex]
            .options.length;
          i++
        ) {
          newOptionHTML =
            '<div class="choice-' +
            i +
            '"><span class="choice-' +
            i +
            '">' +
            characterArr[i] +
            '</span><p class="choice-' +
            i +
            '">' +
            storageQuestList.getQuestionCollection()[progress.questionIndex]
              .options[i] +
            "</p></div>";

          domItems.quizOptionWrapper.insertAdjacentHTML(
            "beforeend",
            newOptionHTML
          );
        }
      }
    },
    displayProgress: function (storageQuestList, progress) {
      domItems.progressBar.max =
        storageQuestList.getQuestionCollection().length;
      domItems.progressBar.value = progress.questionIndex + 1;
      domItems.progressPar.textContent =
        progress.questionIndex +
        1 +
        "/" +
        storageQuestList.getQuestionCollection().length;
    },
    newDesign: function (ansResult, selectedAnswer) {
      var twoOptions;
      twoOptions = {
        instAnswerText: ["This is a wrong answer", "this is a correct answer"],
      };
      domItems.quizOptionWrapper.style.cssText =
        "opacity: 0.6; pointer-events: none;";
      domItems.instAnsContainer.style.opacity = 1;
      domItems.instAnsText.textContent = twoOptions.instAnswerText[0];
    },
  };
})();

/*************************
        Controller Module
     *************************/
const controller = (function (quizCtrl, UICntrl) {
  const selectedDomItems = UIController.getDomItems;
  UICntrl.addInputsDynamically();
  UICntrl.createQuestionList(quizController.getQuestionLocalStorage);

  selectedDomItems.questionInsertBtn.addEventListener("click", () => {
    var adminOptions = document.querySelectorAll(".admin-option");
    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );
    if (checkBoolean) {
      UICntrl.createQuestionList(quizController.getQuestionLocalStorage);
    }
  });

  selectedDomItems.insertedQuestionsWrapper.addEventListener(
    "click",
    function (e) {
      UICntrl.editQuestList(
        e,
        quizCtrl.getQuestionLocalStorage,
        UICntrl.addInputsDynamically,
        UICntrl.createQuestionList
      );
    }
  );
  selectedDomItems.questsClearBtn.addEventListener("click", function () {
    UICntrl.clearQuestList(quizController.getQuestionLocalStorage);
  });

  UICntrl.displayQuestion(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  UICntrl.displayProgress(
    quizController.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  selectedDomItems.quizOptionWrapper.addEventListener("click", function (e) {
    var updatedOptionDiv =
      selectedDomItems.quizOptionWrapper.querySelectorAll("div");
    for (let i = 0; i < updatedOptionDiv.length; i++) {
      if (e.target.className === "choice-" + i) {
        var answer = document.querySelector(
          ".quiz-options-wrapper div p." + e.target.className
        );
        var answerResult = quizCtrl.checkAnswer(answer);
        UICntrl.newDesign(answerResult, answer);
      }
    }
  });
})(quizController, UIController);

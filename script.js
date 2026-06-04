let addBtn = document.getElementById("addBtn");

let taskInput = document.getElementById("taskInput");

let taskDate = document.getElementById("taskDate");

let taskList = document.getElementById("taskList");

let priority = document.getElementById("priority");

let searchTask = document.getElementById("searchTask");

let allBtn = document.getElementById("allBtn");

let completedBtn = document.getElementById("completedBtn");

let pendingBtn = document.getElementById("pendingBtn");

let progressBar = document.getElementById("progressBar");

let progressText = document.getElementById("progressText");

let notificationSound =
document.getElementById("notificationSound");

let alarmSound =
document.getElementById("alarmSound");

let timer =
document.getElementById("timer");

let startTimer =
document.getElementById("startTimer");

let pauseTimer =
document.getElementById("pauseTimer");

let resetTimer =
document.getElementById("resetTimer");

let totalTasks =
document.getElementById("totalTasks");

let completedTasks =
document.getElementById("completedTasks");

let pendingTasks =
document.getElementById("pendingTasks");

window.addEventListener("load", loadTasks);

addBtn.addEventListener("click", addTask);

searchTask.addEventListener("keyup", searchTasks);

function addTask(){

    let taskText = taskInput.value.trim();

    let taskTime = taskDate.value;

    let taskPriority = priority.value;

    if(taskText === ""){

        alert("Please enter a task");

        return;
    }

    createTaskElement(taskText, taskTime, taskPriority);

    saveTask(taskText, taskTime, taskPriority);
    updateProgress();
    updateDashboard();

    taskInput.value = "";
    taskDate.value = "";
}

function createTaskElement(text, time, taskPriority){

    let li = document.createElement("li");

    li.classList.add("task-item");

    if(taskPriority === "High"){

        li.classList.add("high");
    }

    else if(taskPriority === "Medium"){

        li.classList.add("medium");
    }

    else{

        li.classList.add("low");
    }

    li.innerHTML = `

        <div class="task-info">

            <h3>${text}</h3>

            <p>${time}</p>

            <small>${taskPriority} Priority</small>

        </div>

        <div class="task-buttons">

            <button class="complete-btn">
                Complete
            </button>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>

    `;

    taskList.appendChild(li);

    let completeBtn = li.querySelector(".complete-btn");

    let editBtn = li.querySelector(".edit-btn");

    let deleteBtn = li.querySelector(".delete-btn");

   completeBtn.addEventListener("click", function(){

    li.querySelector(".task-info")
    .classList.toggle("completed");

    updateLocalStorage();

    updateProgress();
    updateDashboard();
    alarmSound.pause();

    alarmSound.currentTime = 0;

});

    editBtn.addEventListener("click", function(){

        let newTask = prompt(
            "Edit Task",
            li.querySelector("h3").innerText
        );

        if(newTask !== null && newTask.trim() !== ""){

            li.querySelector("h3").innerText = newTask;

            updateLocalStorage();
        }

    });

    deleteBtn.addEventListener("click", function(){

        li.remove();

        updateLocalStorage();
        updateProgress();
        updateDashboard();

    });

}

function saveTask(text, time, taskPriority){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({

        text:text,
        time:time,
        priority:taskPriority

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks(){

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function(task){

        createTaskElement(
            task.text,
            task.time,
            task.priority
        );
        updateProgress();
        updateDashboard();

    });

}

function updateLocalStorage(){

    let tasks = [];

    document.querySelectorAll(".task-item")
    .forEach(function(task){

        tasks.push({

            text:task.querySelector("h3").innerText,

            time:task.querySelector("p").innerText,

            priority:task.querySelector("small").innerText
            .replace(" Priority","")

        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function searchTasks(){

    let input =
    searchTask.value.toLowerCase();

    let tasks =
    document.querySelectorAll(".task-item");

    tasks.forEach(function(task){

        let text =
        task.querySelector("h3")
        .innerText
        .toLowerCase();

        if(text.includes(input)){

            task.style.display = "flex";
        }

        else{

            task.style.display = "none";
        }

    });

}
allBtn.addEventListener("click", function(){

    let tasks =
    document.querySelectorAll(".task-item");

    tasks.forEach(function(task){

        task.style.display = "flex";

    });

});

completedBtn.addEventListener("click", function(){

    let tasks =
    document.querySelectorAll(".task-item");

    tasks.forEach(function(task){

        let completed =
        task.querySelector(".task-info")
        .classList.contains("completed");

        if(completed){

            task.style.display = "flex";
        }

        else{

            task.style.display = "none";
        }

    });

});

pendingBtn.addEventListener("click", function(){

    let tasks =
    document.querySelectorAll(".task-item");

    tasks.forEach(function(task){

        let completed =
        task.querySelector(".task-info")
        .classList.contains("completed");

        if(!completed){

            task.style.display = "flex";
        }

        else{

            task.style.display = "none";
        }

    });

});
function updateProgress(){

    let tasks =
    document.querySelectorAll(".task-item");

    let completedTasks =
    document.querySelectorAll(".completed");

    let total = tasks.length;

    let completed = completedTasks.length;

    let percent = 0;

    if(total > 0){

        percent =
        Math.round((completed / total) * 100);
    }

    progressBar.style.width =
    percent + "%";

    progressText.innerText =
    `${percent}% Completed`;

    function updateDashboard(){

    let tasks =
    document.querySelectorAll(".task-item");

    let completed =
    document.querySelectorAll(
    ".task-info.completed"
    );

    totalTasks.innerText =
    tasks.length;

    completedTasks.innerText =
    completed.length;

    pendingTasks.innerText =
    tasks.length - completed.length;

}

}
setInterval(function(){

    let now = new Date();

    let currentTime =
    now.toISOString().slice(0,16);

    document.querySelectorAll(".task-item")
    .forEach(function(task){

        let taskTime =
        task.querySelector("p").innerText;

        let taskName =
        task.querySelector("h3").innerText;

        let taskInfo =
        task.querySelector(".task-info");

        let completed =
        taskInfo.classList.contains("completed");

        if(taskTime === currentTime && !completed){

            notificationSound.play();

            alert(`Reminder: ${taskName}`);

            if(Notification.permission === "granted"){

                new Notification("Task Reminder",{

                    body:taskName

                });

            }

        }

        let taskDate = new Date(taskTime);

      if(now > taskDate && !completed){

    task.classList.add("overdue");

    if(alarmSound.paused){

        alarmSound.play();

    }

}

        else{

            task.classList.remove("overdue");

        }

    });

},10000);
let timeLeft = 1500;

let timerInterval;

function updateTimer(){

    let minutes =
    Math.floor(timeLeft / 60);

    let seconds =
    timeLeft % 60;

    timer.innerText =
    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

startTimer.addEventListener("click", function(){

    clearInterval(timerInterval);

    timerInterval = setInterval(function(){

        if(timeLeft > 0){

            timeLeft--;

            updateTimer();

        }

        else{

            clearInterval(timerInterval);

            notificationSound.play();

            alert("Pomodoro Session Completed!");

        }

    },1000);

});

pauseTimer.addEventListener("click", function(){

    clearInterval(timerInterval);

});

resetTimer.addEventListener("click", function(){

    clearInterval(timerInterval);

    timeLeft = 1500;

    updateTimer();

});

updateTimer();
pauseNotification.addEventListener("click", function(){

    notificationSound.pause();

    notificationSound.currentTime = 0;

});

stopAlarm.addEventListener("click", function(){

    alarmSound.pause();

    alarmSound.currentTime = 0;


});

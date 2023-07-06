// let todo = document.getElementById('todoApp')
// for (let index = 0; index < 30; index++) {
//     let div = document.createElement('div')
//     div.innerHTML = index;
//     div.style.height = '40px'
//     div.style.color = '#fff '
//     div.style.backgroundColor = `rgb(0, 0,${255 / 30 * index})`
//     todo.appendChild(div)
// }

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAL9a9dH5D0WzW5PwrlIX-KVj7jxGjBeEQ",
    authDomain: "web-app-development-4761c.firebaseapp.com",
    databaseURL: "https://web-app-development-4761c-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "web-app-development-4761c",
    storageBucket: "web-app-development-4761c.appspot.com",
    messagingSenderId: "362560056887",
    appId: "1:362560056887:web:4b460f6c08eba94269d9b2",
    measurementId: "G-RV7RMLH579"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase()

function createTodo(todoText, id) {
    //create parent node
    let todo = document.createElement('div')
    todo.id = id
    todo.className = "todoItem"
    //create text div
    let todoDiv = document.createElement('div')
    todoDiv.className = "todoText"
    todoDiv.innerHTML = todoText;
    //add text div
    todo.appendChild(todoDiv)
    //create options div
    let todoOptions = document.createElement('div')
    todoOptions.className = "todoOptions";
    //create edit button
    let editButton = document.createElement('button')
    editButton.innerHTML = 'Edit'
    editButton.onclick = () => {
        //on click of edit button save innerHTML of todoDiv
        let temp = todoDiv.innerHTML
        todoDiv.innerHTML = ""
        //create input tag to add in the todoDiv
        let input = document.createElement('input')
        //set value of input to the innerHTML of the todoDiv
        input.value = temp
        //finally add input into the todoDiv
        todoDiv.appendChild(input)
        //create cancel button
        let cancelButton = document.createElement('button')
        cancelButton.innerHTML = "Cancel"
        //on click remove the input we made from the todoDiv and add the temp innerHTML back into the todoDiv
        cancelButton.onclick = () => {
            //Replace cancel button back with edit button
            input.remove()
            todoDiv.innerHTML = temp
            cancelButton.replaceWith(editButton)
            confirmButton.replaceWith(deleteButton)
        }
        //also replace edit button with cancel button
        editButton.replaceWith(cancelButton)

        //create confirm button
        let confirmButton = document.createElement('button')
        confirmButton.innerHTML = "Confirm"
        confirmButton.onclick = () => {
            //on click take value of the input in todoDiv and remove the input from todoDiv.
            let newValue = todoDiv.getElementsByTagName('input')[0].value
            // input.remove()
            // Save value of input to innerHTML of todoDiv
            // todoDiv.innerHTML = newValue;
            //replace confirm button back with delete button
            // confirmButton.replaceWith(deleteButton)
            // cancelButton.replaceWith(editButton)
            var refrence = ref(database, `/TODOS/${id}`)
            var obj = {
                value: newValue
            }
            update(refrence, obj)
        }
        //replace delete button with confirm button
        deleteButton.replaceWith(confirmButton)
    }
    //create delete button
    let deleteButton = document.createElement('button')
    deleteButton.innerHTML = "Delete"
    //on click remove the todo from the dom
    deleteButton.onclick = () => {
        // todo.remove()
        let refrence = ref(database, `/TODOS/${id}`)
        remove(refrence,);
    }
    //add both buttons
    todoOptions.appendChild(editButton)
    todoOptions.appendChild(deleteButton)
    //add options div to parent
    todo.appendChild(todoOptions)
    // console.log(todo)
    return todo
    //expected outcome
    // < div class="todoItem" id="2212">
    //     <div class="todoText">A TODO ITEM</div>
    //     <div class="todoOptions">
    //         <button>Edit</button>
    //         <button>Delete</button>
    //     </div>
    // </div >
}

window.addTodo = function () {
    let input = document.getElementById('input')
    let refrence = ref(database, "TODOS");
    let id = push(refrence).key;
    var obj = {
        value: input.value,
        key: id,
    }
    refrence = ref(database, `/TODOS/${id}/`);
    set(refrence, obj);
    input.value = ""
}

function render(list) {
    document.getElementById('todos').innerHTML = ""
    for (let index = 0; index < list.length; index++) {
        const todo = list[index];
        document.getElementById('todos').appendChild(createTodo(todo.value, todo.key))
    }
}

let refrence = ref(database, "/TODOS");
onValue(refrence, function (data) {
    let dataObj = data.val();
    let list = Object.values(dataObj || {});
    render(list);
})
let myNodelist = document.getElementsByTagName("LI")
for(let i=0;i<myNodelist.length;i++){
let btn = document.createElement("button")
let btn1 = document.createElement("button")
btn.className="close"
btn1.className="edit"

btn.innerHTML = "Delete"
btn1.innerHTML = "Edit"
btn.addEventListener("click", function () {
    myNodelist[i].style.display = 'none'

})
btn1.addEventListener("click", function () {
    let newText = prompt("Edit task:", span.textContent);
    if (newText !== null && newText !== "") {
        span.textContent = newText;
    }
});
myNodelist[i].addEventListener("click",function(){
    myNodelist[i].className="checked"
})
myNodelist[i].appendChild(btn)
myNodelist[i].appendChild(btn1)

}
function newTask() {
    let input = document.getElementById("myInput");
    if (input.value === "") {
        alert("Enter the title of the task");
        return;
    }

    let ul = document.getElementById("myUL");
    let li = document.createElement('li');
    let span = document.createElement('span');
    let bt = document.createElement("button");
    let bt1 = document.createElement("button");

    span.textContent = input.value;
    li.appendChild(span);
    input.value = "";

    bt.innerHTML = 'Delete';
    bt1.innerHTML = 'Edit';
    bt.className = 'close';
    bt1.className = 'edit';
    bt.addEventListener("click", function () {
        li.remove();
    });
    li.appendChild(bt);

    ul.appendChild(li);
    li.appendChild(bt1);
    ul.appendChild(li);
    li.addEventListener("click", function () {
        li.classList.toggle("checked");
    });

    bt1.addEventListener("click", function () {
        let newText = prompt("Edit task:", span.textContent);
        if (newText !== null && newText !== "") {
            span.textContent = newText;
        }
    });
}

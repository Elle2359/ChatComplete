
const container = document.getElementById('container');
const open = document.getElementById('open1');
const close1 = document.getElementById('close1');
const container1 = document.getElementById('container1');

open.addEventListener('click', ()=>{
    container1.classList.add('active')
    
    
});

close1.addEventListener('click', ()=>{
    container1.classList.remove('active')
});


const token = localStorage.getItem('token');
let localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
let lastMsgId;


// loading page calling backend to get user list and msgs
window.addEventListener('load',()=>{
    showGroupMembers(); //this will print user 

    if(localTextSaved){
        getMessageFromLocal();
    }
    userGroups();

    setInterval(()=>{
   // updateMessage();
    },3000)
})


function showGroupMembers(){
    axios.get('http://localhost:3000/getuser',{headers:{"Authorization":token}})
    .then(res=>{
        //res.data.listOfUser.forEach(user => {
            //addUserToDOM(user);
        //});
       
       addUserToDOM(res.data.listOfUser[0])     
   
            
        
    })
    .catch(err=>{
        console.log(err)
        
    })
}


// showing user list on dom
function addUserToDOM(quser){
    const parentElement = document.getElementById('user');
    parentElement.innerHTML += `
        <li id=${quser}>
            ${quser} joined the group
        </li>`
}


//mesage sending to backend and same time showing on the 
function sendmessage(e){
    e.preventDefault();

    const grpId = document.querySelector('#grp-id').value
    const message = document.querySelector('#text-input')

    if(message.value == ''){
        message.placeholder = "Please enter message"
        message.classList.add('empty')
    }else{
        axios.post('http://localhost:3000/addMessage', {groupid: grpId, msg: message.value}, { headers: {"Authorization" : token}})
        .then(res=>{
            console.log(res.data.result)

            const details = res.data.result
            const date = details.createdAt.slice(0,10)
            const time = details.createdAt.slice(11,16)

            displayMessage(details.name, details.msg, date, time)

        })
        .catch(err=>console.log(err))
    }
}
function getGrpMembers(id){
   
    
    axios.get(`http://localhost:3000/getMembers?grpId=${id}`,{headers:{'Authorization':token}})
    .then(response=>{
            var members= response.data.listOfUsers;
            
           
            const parentElement = document.getElementById('group-container');
            for (i=0; i<members.length; i++) {
              
              parentElement.innerHTML += `
                    <li id=${id} >userId
                    ${members[i].name} 
                    <a href="./admin?grpId=${id}" id="leaderboard">Admin Controls</a>
                     </li>` 
                
             }

        alert(response.data.message);
    })
    .catch(err=>{
        console.log(err);
        //alert(err.response.data.message)
       
    })
   
}


function getMessageFromLocal(){
    let  localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
    // console.log(localTextSaved);
    localTextSaved.forEach(element => {
        addMsgToDOM(element.message,element.senderName)
    });
}


function addMsgToDOM(message,name){
    const parentElement = document.getElementById('message');
    // parentElement.innerHTML = " ";
    parentElement.innerHTML += `
        <li id=${name}>
            ${name}: ${message}
        </li>`
}




function createGroup(e){
    e.preventDefault();

    const form = new FormData(e.target);
     const groupname=document.getElementById('groupname-input').value
    const groupName ={  grpName:groupname,isAdmin:true}
      
    console.log(groupName);
    axios.post('http://localhost:3000/creategroup',groupName,{headers:{"Authorization":token}})
    .then(response=>{
        console.log(response);
       
            document.getElementById('groupname-input').value = "";
            alert(response.data.message)
    
    })
    .catch(err=>{
        console.log(err);
        
    })

    
}



async function userGroups(){
    const groupList= document.getElementById('groups-list')
    axios.get('http://localhost:3000/getgroups',{headers:{"Authorization":token}})
    .then(res=>{
        
        console.log(res.data)

        let groups = res.data.groups
        for(let i=0;i<groups.length;i++){

            let li = document.createElement("li")
            li.className = "list-group-item"
           
            li.innerHTML=` 
            <button onclick="showGrpMsg(${groups[i].id})">${groups[i].groupname}</button>
            <button class="btn btn-link" onclick="getGrpMembers(${groups[i].id})">${groups[i].groupname}members
            </button>
            
            <p id='created'>Created : ${groups[i].createdAt.slice(0,10)}</p>`
           
            groupList.appendChild(li)
        }
        
        })
    
}

async function showGrpMsg(id){

    axios.get(`http://localhost:3000/getMessages?grpId=${id}`, { headers: {"Authorization" : token} })
    .then(res=>{
        //console.log(res)
        
        const messages = res.data.messages
        const parentElement = document.getElementById('message-container');
        const userElement = document.getElementById('user');
        const form = document.getElementById("input-area")
        form.innerHTML = "";
        userElement.innerHTML = " ";
        parentElement.innerHTML = " ";
        const msgForm = document.createElement('form');
        let fn = "return sendmessage(event)"
        msgForm.setAttribute('onSubmit',fn);
        
        messages.forEach(element => {
            parentElement.innerHTML += `
            <li id=${element.id}>
                ${element.name}: ${element.msg}
            </li>`

        });
        let input = document.createElement('input');
        let hidden = document.createElement('input');
        hidden.name = "grp-id";
        hidden.type = "hidden";
        hidden.value = `${id}`
        input.name = 'messagec';
        input.type = 'text';
        hidden.setAttribute("id","grp-id");
        input.setAttribute("id","text-input");
        input.setAttribute("placeholder","Type Message For Group...");
        let button = document.createElement('button');
        button.type = 'submit';
        button.innerHTML = "Send"
        button.na
        button.className = "fas fa-paper-plane";
        msgForm.appendChild(input);
        msgForm.appendChild(hidden);
        msgForm.appendChild(button);
        form.appendChild(msgForm);
       

        
        for(let i=0; i<messages.length; i++){
            const date = messages[i].createdAt.slice(0,10)
            const time = messages[i].createdAt.slice(11,16)

            displayMessage(messages[i].name, messages[i].msg, date, time)
        }
    })
   

}

function displayMessage(name, message, date, time){
    
    let messageContainer = document.getElementById('message')
    chats = document.createElement('li')

    messageContainer.innerHTML = `
    <li id=${name}>
    ${name}: ${message}
     </li>
     <p><small>${date} &nbsp;&nbsp; ${time}</small></p>
    `
        
   
}
let logoutBtn = document.querySelector('#logout')
logoutBtn.addEventListener('click', (e)=>{
    localStorage.clear()
    window.location.replace('./login')
})



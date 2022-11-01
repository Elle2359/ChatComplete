const token = localStorage.getItem('token')

let grpId

const addBtn = document.querySelector('#add-btn')
const removeBtn = document.querySelector('#remove-btn')
const adminBtn = document.querySelector('#admin-btn')
const removeAdminBtn = document.querySelector('#remove-admin-btn')


const addEmail = document.querySelector('#add')
const removeEmail = document.querySelector('#remove')
const adminEmail = document.querySelector('#add-admin')
const removeAdminEmail = document.querySelector('#remove-admin')


window.addEventListener('DOMContentLoaded', (e)=>{
    e.preventDefault()
    const url = window.location.href
    grpId = url.split('grpId=')[1]
})

addBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    
    if(addEmail.value == ''){
        addEmail.placeholder = 'Please enter email'
        addEmail.classList.add('empty')
    }else{
        axios.post('http://localhost:3000/addMember', {grpId: grpId, email: addEmail.value}, { headers: {"Authorization" : token}})
        .then(res=>{
            //console.log(res.status)
            showPopupMessage("Member Added Successfully")
        })
        .catch(err=>{
            // console.log(err.response.status)
            // console.log(err.response.data.msg)
            showPopupMessage(err.response.data.msg)
        })
    }
    

})

removeBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    if(removeEmail.value == ''){
        removeEmail.placeholder = 'Please enter email'
        removeEmail.classList.add('empty')
    }else{
        axios.post('http://localhost:3000/removeMember', {grpId: grpId, email: removeEmail.value}, { headers: {"Authorization" : token}})
        .then(res=>{
            console.log(res.data)
            if(res.data.removeMember){
                showPopupMessage("Member removed Successfully")
            }else{
                showPopupMessage("Member not present in group")
            }
            
        })
        .catch(err=>{
            //console.log(err.response.status)
            //console.log(err.response.data.msg)
            showPopupMessage(err.response.data.msg)
        })
    }
    
})

adminBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    if(adminEmail.value == ''){
        adminEmail.placeholder = 'Please enter email'
        adminEmail.classList.add('empty')
    }else{
        axios.post('http://localhost:3000/makeAdmin', {grpId: grpId, email: adminEmail.value}, { headers: {"Authorization" : token}})
        .then(res=>{
            console.log(res.data)
            if(res.data.adminMember[0]){
                showPopupMessage("Member is Admin now")
            }else{
                showPopupMessage("Member not present in group. Please Add member to group first")
            }
            
        })
        .catch(err=>{
            // console.log(err.response.status)
            // console.log(err.response.data.msg)
            showPopupMessage(err.response.data.msg)
        })
    }
    
})

removeAdminBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    if(removeAdminEmail.value == ''){
        removeAdminEmail.placeholder = 'Please enter email'
        removeAdminEmail.classList.add('empty')
    }else{
        axios.post('http://localhost:3000/removeAdmin', {grpId: grpId, email: removeAdminEmail.value}, { headers: {"Authorization" : token}})
        .then(res=>{
            console.log(res.data)
            if(res.data.adminMember[0]){
                showPopupMessage("Member removed from Admin position")
            }else{
                showPopupMessage("Member not present in group. Please Add member to group first")
            }
            
        })
        .catch(err=>{
            // console.log(err.response.status)
            // console.log(err.response.data.msg)
            showPopupMessage(err.response.data.msg)
        })
    }
    
})

const btn = document.getElementById("btn");
const nav = document.getElementById("nav");

btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    btn.classList.toggle("active");
});


let logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener('click', (e)=>{
    localStorage.clear()
    window.location.replace('./login')
})


function showPopupMessage(msg){
    const popContainer = document.querySelector('.popup-container')
    const popMessage = document.querySelector('.popup-message')


    popMessage.innerHTML = `
    <p>${msg}</p>
    `
    popContainer.classList.add('active')

    setTimeout(()=>{
        popContainer.classList.remove('active')
    }, 2000)
}


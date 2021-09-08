function judgePerm(buttonId){
    let permissions = JSON.parse(sessionStorage.getItem("accountInfo")).permissions;
    let isExist = false;
    permissions.forEach(item =>{
        if(item.id == buttonId){
            isExist = true;
        }
    })
    return isExist;
  }

  export default {
    judgePerm
  }
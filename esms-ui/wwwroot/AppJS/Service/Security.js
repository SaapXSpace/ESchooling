//const CryptoJS = require('crypto-js');

export const ENCRYPT =(text)=>{
  //return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  const base64data = Utilities.base64Encode(text, Utilities.Charset.UTF_8);
    return base64data;
};

export const DECRYPT = (data) => {
  //return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  const base64data =Utilities. Utilities.base64data(text, Utilities.Charset.UTF_8);
    return base64data;
};

export const Roles = Object.freeze({
  Admin : "Admin",
  Manager : "Manager",
  Requester : "Requester",
  Crew : "Crew",
})

export const Status = Object.freeze({
  Pending : "Pending",
  Completed : "Completed",
  Assigned : "Assigned",
  Cancel : "Cancel",
})



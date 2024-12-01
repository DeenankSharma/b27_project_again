import axios from "axios";
import {  useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const RegisterPage:React.FC = () =>{
  const [name,setName] = useState<string>('');
  const[isLoading,setIsLoading] = useState<boolean>(false);
  const [nameNotFilled,setNameNotFilled] = useState<boolean>(false)
  const navigate = useNavigate()
  const[isNotUnique,setIsNotUnique] = useState<boolean>(false)
  
  function onNameFill(e: React.ChangeEvent<HTMLInputElement>) {
    const _name = e.target.value.trim();
    setName(_name);
  }

  useEffect(()=>{
    localStorage.setItem('name',JSON.stringify(name))
  },[name])

  async function nameSubmit(){
    if(name!=''){
      setIsLoading(true);
      const response = await axios.post<string>('');
      if(response.status !== 200){
        setIsNotUnique(true);
        setName('');
        setIsLoading(false);
        localStorage.removeItem('name');
      }
      else if(response.status === 200){
        setIsNotUnique(false)
        setIsLoading(false)
        navigate('/landing')
        setName('');
      }
    }
    else if(name===''){
      setNameNotFilled(true)
    }
  }

  function alreadyRegistered(){
    navigate('registered')
  }

  return(<>
  <div className="MainRegisterDiv">
  <h1 className="registerPageHeading">
      InterViewer
    </h1>
    <h3 className="registerPageSubHeading">
      Mock Interviews On The Go
    </h3>
    <div style={{"width":"60%"}}>
      {isNotUnique?<label className="registerLabel" htmlFor="name">Enter Username <span style={{"color":'grey'}}>(Username Already Exists)</span></label>:<label className="registerLabel" htmlFor="name">Enter Username </label>}
      <input value={name} onChange={onNameFill} id="name" name="name" type="text" autoSave="false" autoCorrect="false" />
    </div>
    {isLoading ? <button disabled onClick={nameSubmit}  className="registerButton">
      Register
    </button>:<button onClick={nameSubmit}  className="registerButton">
      Register
    </button> }
    {nameNotFilled?
    <h5 className="nameNotfilled ">
      Username Field is Mandatory!
    </h5>:null
    }
    <h5 onClick={alreadyRegistered} className="alreadyUser">
      Already a user?
    </h5>
  </div>
  </>)
}

export default RegisterPage
import React, {useEffect, useState} from 'react';
import modal from './ModalWindows.module.css'
import styles from  '../components/Component.module.css'
import Cross from "../components/Cross";
import InputResult from "../components/InputResult";
import CrossRed from "../components/CrossRed";
import ButtonOrder from "../components/ButtonOrder";


const ModalWindows = ({
      visible = false,
      product,
      onClose,
}) => {
    const [userName, setUserName] = useState('')
    const [checkName, setCheckName] = useState('')
    const [focusName, setFocusName] = useState(false)
    const [userPhone, setUserPhone] = useState('')
    const [checkPhone, setCheckPhone] = useState('')
    const [focusPhone, setFocusPhone] = useState(false)

    const enterName = (e)=>setUserName(e.target.value)
    const enterPhone = (e)=>setUserPhone(e.target.value)

    const checkNameBlur = ()=>{
        if (!userName.length) {
            setCheckName('This field in required')
        } else if (userName.split('').find((l)=>!/[a-zA-Zа-яА-ЯёЁ\s]/i.test(l))) {
            setCheckName('Only letters allowed')
        } else setCheckName('ok')

    }

    const checkPhoneBlur = ()=>{
        if (!userPhone.length) {
            setCheckPhone('This field in required')
        } else if(!Number.isInteger(Number(userPhone)) ){
            setCheckPhone('Only numbers allowed')
        }else if( userPhone.split('').length !== 12){
            setCheckPhone('Should contain 12 characters')
        } else setCheckPhone('ok')
    }

    const submitForm = (e)=>{
        e.preventDefault();
        checkNameBlur();
        checkPhoneBlur();
        const user = {
            name: userName,
            phone: userPhone
        }
       if (checkName==='ok' && checkPhone==='ok') {
           fetch('http://localhost:4000/purchase', {
               method: 'POST',
               mode: 'cors',
               credentials: 'include',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(user),

           })
               .then(function(response) {
                   return response.json()
               }).then(function(body) {
               console.log(body);
           });
       }
    }

    const onKeydown = (e) => {
        switch (e.code) {
            case 'Escape':
                onClose()
                break
            default:
        }
    }
    useEffect(()=>{
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })

    useEffect(()=>{
        setUserName('');
        setUserPhone('');
        setCheckName('');
        setCheckPhone('');
        setFocusName(false);
        setFocusPhone(false)

    },[visible])

    if (!visible) return null;
    return (
        <div className={modal.modal} >
            <div className={modal.modal_dialog} onClick={e => e.stopPropagation()}>
                <div className={modal.modal_close} onClick={onClose}><Cross/></div>
                <div className={modal.modal_content}>
                    <div className={styles.category}>{product.category}</div>
                    <div className={styles.name}>{product.name}</div>
                    <div className={styles.price_box}>
                        <span className={styles.dollar_sign}>$</span>
                        <span className={styles.price}> {product?.price}</span>
                    </div>
                    <form onSubmit={submitForm}>
                        {checkName ==='' ? <input                            // первый вариант  стилизации input
                            autoFocus={focusName}
                            className={modal.modal_input}
                            type="text"
                            placeholder="Name"
                            value={userName}
                            onChange={enterName}
                            onBlur={checkNameBlur}
                        />: checkName !=='ok' ? <InputResult
                            setCheck={setCheckName}
                            value={userName}
                            setValue={setUserName}
                            setFocus={setFocusName}
                            styles={{border: '1px solid #E43F3F'}}
                        /> : <InputResult
                            setCheck={setCheckName}
                            value={userName}
                            setFocus={setFocusName}
                            styles={{border: '1px solid #4BCFA0'}}
                        />
                        }
                        {checkName && checkName !=='ok' ? <div className="error_text">{checkName}</div>:
                            <div style={{visibility: 'hidden'}} className="error_text">hide text</div>}


                       <div className={modal.input_block}>
                            {checkPhone && checkPhone !=='ok' && userPhone !=='' &&  // второй вариант  стилизации input
                            <span
                                className={modal.red_cross_abs}
                                onClick={()=>{
                                    setUserPhone('');
                                    setCheckPhone('')
                                }}
                            ><CrossRed/></span>}
                            <input
                            autoFocus={focusPhone}
                            className={modal.modal_input}
                            type="text"
                            placeholder="Number"
                            value={userPhone}
                            onChange={enterPhone}
                            onBlur={checkPhoneBlur}
                            onFocus={()=>setCheckPhone('')}
                            style={!checkPhone ? {border: '1px solid rgba(0, 0, 0, 0.2)'}: checkPhone ==='ok'?
                                {border: '1px solid #4BCFA0'} : {border: '1px solid #E43F3F'}}
                            />
                        </div>
                        {/*<div style={{visibility: checkPhone && checkPhone !=='ok' ? 'visible' :'hidden' }} className="error_text">{checkPhone}</div>*/}
                        {checkPhone && checkPhone !=='ok' ? <div className={modal.error_text}>{checkPhone}</div>:
                            <div style={{visibility: 'hidden'}} className={modal.error_text}>hide text</div>}
                        <ButtonOrder/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalWindows;
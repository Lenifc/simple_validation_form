import { useEffect, useState } from "react"
import './Form.css'

export default function Form(){

    const errMsg_textRequired = 'Text is required!'
    const errMsg_tooManyCharacters = "You can't enter more than 255 characters!"
    const errMsg_inputNumber = 'Please, input number'

    const availableInputCharacters = 255
    const [textareaInputs, setTextAreaInputs] = useState('')
    const [textareaError, setTextAreaError] = useState(false)

    const [radioButtonSelection, setRadioButtonSelection] = useState('')
    const [radioButtonError, setRadioButtonError] = useState(false)

    const VATOptions = [
        {
            label: '19%',
            value: 0.19
        },
        {
            label: '21%',
            value: 0.21
        },
        {
            label: '23%',
            value: 0.23
        },
        {
            label: '25%',
            value: 0.25
        },
    ]
    const [selectedVAT, setSelectedVAT] = useState('')
    const [selectInputError, setSelectInputError] = useState(false)

    const [nettoPriceInput, setNettoPriceInput] = useState('')
    const [nettoPriceInputError, setNettoPriceInputError] = useState(false)
    const [bruttoPriceInput, setBruttoPriceInput] = useState('')


    const [sendingData, setSendingData] = useState(false)
    const [responseStatus, setResponseStatus] = useState(null)


        // do not allow to enter more than 255 characters in Description (even by copy/paste) 
    function checkCharacters(value){
        if(value?.length <= 255) setTextAreaInputs(value)
        else return
    }

    function validateNetValue(value){
        // replace all comas with dots and then allow only digits and dot, remove all extra dots except first (allow only one)
        value = value.replace(',', '.').replace(/[^\d.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, ".")
        
        // do not allow more than 2 digits after a dot
        if(value.indexOf('.') > -1 && value.indexOf('.') + 3 < value.length) return

        // check if there are still any invalid characters by any chance
        if(isNaN(parseFloat(value))) setNettoPriceInputError(errMsg_inputNumber)
        else setNettoPriceInputError(false)
        
        setNettoPriceInput(value)
    }

    function validateBruttoValue(){
        if(selectedVAT && nettoPriceInput) {
            //calculate brutto value
            let bruttoValue = parseFloat(Number(nettoPriceInput) + Number(nettoPriceInput * selectedVAT))
            if(isNaN(bruttoValue)) setBruttoPriceInput('') // if any invalid netto price is provided then clear brutto price
            else setBruttoPriceInput(bruttoValue.toFixed(2))
        } else setBruttoPriceInput('') // if any condition is missing then keep brutto value clear
    }



    function checkForErrors(e){
        e.preventDefault()
        
        if(!selectedVAT) setSelectInputError(errMsg_textRequired)
        if(!nettoPriceInput) setNettoPriceInputError(errMsg_inputNumber)
        if(!radioButtonSelection) setRadioButtonError(errMsg_textRequired)

        // checking if radio button has valid value - of course it should be better secured on back-end side
        if(selectedVAT && nettoPriceInput && 
            (radioButtonSelection === 'yes' || radioButtonSelection === 'no')) {
            submitForm()
        }
    }

    // check if any error messages still persists
    function submitForm(){
        if(!textareaError && 
            !radioButtonError && 
            !selectInputError && 
            !nettoPriceInputError) {
                setSendingData(true)
                sendData()
        }
    }

    function clearForm(e){
        e.preventDefault()

        setTextAreaInputs('')
        setTextAreaError(false)
    
        setRadioButtonSelection('')
        setRadioButtonError(false)
    
        setSelectedVAT('')
        setSelectInputError(false)
    
        setNettoPriceInput('')
        setNettoPriceInputError(false)
        setBruttoPriceInput('')
    }

    async function sendData(){
        const combinedData = {
            description: textareaInputs,
            sendConfirmation: radioButtonSelection,
            VAT: selectedVAT,
            netPrice: nettoPriceInput,
            grossPrice: bruttoPriceInput, 
        }

        // return random response; 200 - success; 500 - server/network error
        let url = 'https://httpbin.org/status/200,500'
        let response = await fetch(url, {
            method: 'POST',
            body: combinedData
        })
        if(response) setSendingData(false)
        if(response.status === 200) setResponseStatus('success')
        if(response.status === 500) setResponseStatus('failed')
        if(response.status !== 500 && response.status !== 200) setResponseStatus('client issue')
    }

    //  check for errors in description every user character input
    useEffect(() => {
        setTextAreaError(textareaInputs?.length === 0 ? errMsg_textRequired : textareaInputs?.length >= 255 ? errMsg_tooManyCharacters : false)
    }, [textareaInputs])
    
    useEffect(() => {
        // radioButtonSelection === '' prevents of showing error message immediately after form was loaded
        setRadioButtonError(radioButtonSelection === '' || radioButtonSelection === 'yes' || radioButtonSelection === 'no' ? false : errMsg_textRequired)
    }, [radioButtonSelection])

    //  any select option must be choosen to avoid error
    useEffect(() => {
        setSelectInputError(!selectedVAT && selectedVAT !== '' ? errMsg_textRequired : false)
    }, [selectedVAT])

    //  calculate Brutto value when both conditions pass
    useEffect(() => {
        validateBruttoValue()
    }, [nettoPriceInput, selectedVAT])


    return (
        <>
        
    { responseStatus !== 'success' && <form className="gap-sections">
        
        <h1>Validation Form</h1>

        <div className="textarea-section">
            <label className="textarea-label" htmlFor="description"><h2>Description</h2></label>
            <textarea id="description" className="description" onChange={(e) => checkCharacters(e.target.value)} value={textareaInputs}>{ textareaInputs }</textarea>
            <div className="count-textarea-inputs">Available characters: { (availableInputCharacters - textareaInputs?.length < 0) ? 0 : availableInputCharacters - textareaInputs?.length}</div>
            {textareaError && <div className="textarea-errors errMsg">{ textareaError }</div>}
        </div>


        <div className="confirmation-section">
            <label className="confirmation-label" htmlFor="confirmation"><h2>Send confirmation:</h2></label>
            <div>
                <input type="radio" id="confirmation" name="confirmation" value='yes' checked={radioButtonSelection === 'yes' } onChange={(e) => setRadioButtonSelection(e.target.value)} />
                <span>YES</span>
            </div>
            <div>
                <input type="radio" id="confirmation" name="confirmation" value='no' checked={radioButtonSelection === 'no' } onChange={(e) => setRadioButtonSelection(e.target.value)} />
                <span>NO</span>
            </div>
            {radioButtonError && <div className="radiobutton-errors errMsg">{ radioButtonError }</div>}
        </div>


        <div className="select-input-section">
            <label className="select-input-label" htmlFor="vat"><h2>VAT</h2></label>
            <select id="vat" value={ selectedVAT } options={ VATOptions } onChange={(e) => setSelectedVAT(e.target.value)}>
                <option disabled={true} value='' hidden> Choose VAT </option>
                {VATOptions.map(option => {
                    return (<option value={ option.value } key={ option.value }>{ option.label }</option> )
                }) }
            </select>
            {selectInputError && <div className="select-input-errors errMsg">{ selectInputError }</div>}
        </div>

        <div className="row">
            <div className="price-input-section">
                <label htmlFor="price_net"><h2>Price netto EUR</h2></label>
                <input type="text" disabled={!selectedVAT} value={nettoPriceInput} onChange={(e) => validateNetValue(e.target.value)}></input>
                {nettoPriceInputError && <div className="netto-price-input-errors errMsg">{ nettoPriceInputError }</div>}
            </div>

            <div className="price-input-section">
                <label htmlFor="price_brutto"><h2>Price brutto EUR</h2></label>
                <input type="text" disabled={true} value={bruttoPriceInput} ></input>
            </div>
        </div>

        <div className="buttons-section">
            <button onClick={(e) => checkForErrors(e)} className="button submit-button">Submit</button>
            <button onClick={(e) => clearForm(e)} className="button clear-button">Clear</button>
            {sendingData && <>Sending data...</>}
            {responseStatus === 'failed' && !sendingData && <div className="errMsg response-msg">Network error, please try again!</div>}
        </div> 
    </form>}
    { responseStatus === 'success' && 
    <div className="success-msg"> Your data has been successfully sent to the server! </div>}
    </>
    )
}

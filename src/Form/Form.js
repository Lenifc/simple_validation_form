import { useEffect, useState } from "react"
import './Form.css'

export default function Form(){

    const errorMessage_textRequired = 'Text is required!'
    const errorMessage_tooManyCharacters = "You can't enter more than 255 characters!"

    const availableInputCharacters = 255
    const [textareaInputs, setTextAreaInputs] = useState('')
    const [textareaError, setTextAreaError] = useState(false)

    const [radioButtonSelection, setRadioButtonSelection] = useState('')
    const [radioButtonError, setRadioButtonError] = useState(false)

    const VATOptions = [
        {
            label: '19%',
            value: 19
        },
        {
            label: '21%',
            value: 21
        },
        {
            label: '23%',
            value: 23
        },
        {
            label: '25%',
            value: 25
        },
    ]
    const [selectedVAT, setSelectedVAT] = useState('')
    const [selectInputError, setSelectInputError] = useState(false)


        // do not allow to enter more than 255 characters in Description (even by copy/paste) 
    function checkCharacters(e){
        if(e.target.value.length <= 255) setTextAreaInputs(e.target.value)
        else return
    }

    function checkForErrors(e){
        e.preventDefault()
        
        if(!selectedVAT) setSelectInputError(errorMessage_textRequired)

        // checking if radio button has valid value - of course it should be better secured on back-end side
        if(radioButtonSelection === 'yes' || radioButtonSelection === 'no') {
            submitForm()
        } else setRadioButtonError(errorMessage_textRequired)
    }

    function submitForm(){
        if(!textareaError && !radioButtonError && !selectInputError) console.log('Works fine')
    }

    function clearForm(e){
        e.preventDefault()
    }

    //  check for errors in description every user character input
    useEffect(() => {
        setTextAreaError(textareaInputs?.length === 0 ? errorMessage_textRequired : textareaInputs?.length >= 255 ? errorMessage_tooManyCharacters : false)
    }, [textareaInputs])
    
    useEffect(() => {
        // radioButtonSelection === '' prevents of showing error message immediately after form was loaded
        setRadioButtonError(radioButtonSelection === '' || radioButtonSelection === 'yes' || radioButtonSelection === 'no' ? false : errorMessage_textRequired)
    }, [radioButtonSelection])

    //  any select option must be choosen to avoid error
    useEffect(() => {
        setSelectInputError(!selectedVAT && selectedVAT !== '' ? errorMessage_textRequired : false)
    }, [selectedVAT])

    return (
    <form className="gap-sections">
        
        <h2>Validation Form</h2>

        <div className="textarea-section">
            <label className="textarea-label" htmlFor="description"><h2>Description</h2></label>
            <textarea id="description" className="description" onChange={(e) => checkCharacters(e)} value={textareaInputs}>{ textareaInputs }</textarea>
            <div className="count-textarea-inputs">Available characters: { (availableInputCharacters - textareaInputs?.length < 0) ? 0 : availableInputCharacters - textareaInputs?.length}</div>
            {textareaError && <div className="textarea-errors errorMessage">{ textareaError }</div>}
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
            {radioButtonError && <div className="radiobutton-errors errorMessage">{ radioButtonError }</div>}
        </div>


        <div className="select-input-section">
            <label className="select-input-label" htmlFor="vat"><h2>VAT</h2></label>
            <select id="vat" value={ selectedVAT } options={ VATOptions } onChange={(e) => setSelectedVAT(e.target.value)}>
                <option disabled={true} value='' hidden> Choose VAT </option>
                {VATOptions.map(option => {
                    return (<option value={ option.value } key={ option.value }>{ option.label }</option> )
                }) }
            </select>
            {selectInputError && <div className="select-input-errors errorMessage">{ selectInputError }</div>}
        </div>

        <div className="price-input-section">

        </div>



        <div className="buttons-section">
            <button onClick={(e) => checkForErrors(e)} className="button submit-button">Submit</button>
            <button onClick={(e) => clearForm(e)} className="button clear-button">Clear</button>
        </div> 
    </form>
    )
}

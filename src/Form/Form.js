import { useEffect, useState } from "react"
import './Form.css'

export default function Form(){

    const availableInputCharacters = 255
    const [textareaInputs, setTextAreaInputs] = useState('')
    const [textareaError, setTextAreaError] = useState(false)

    const [radioButtonSelection, setRadioButtonSelection] = useState(null)
    const [radioButtonError, setRadioButtonError] = useState(false)


        // do not allow to enter more than 255 characters in Description (even by copy/paste) 
    function checkCharacters(e){
        if(e.target.value.length <= 255) setTextAreaInputs(e.target.value)
        else return
    }

    function validateForm(e){
        e.preventDefault();
    }

    function clearForm(){

    }

    //  check for errors in description every user character input
    useEffect(() => {
        setTextAreaError(textareaInputs.length === 0 ? 'Text is required!' : textareaInputs.length >= 255 ? "You can't enter more than 255 characters!" : false)
    }, [textareaInputs])

    return (
    <form>
        
        <h2>Validation Form</h2>

        <div className="textarea-section">
            <label className="textarea-label" htmlFor="description"><h2>Description</h2></label>
            <textarea id="description" className="description" onChange={(e) => checkCharacters(e)} value={textareaInputs}>{ textareaInputs }</textarea>
            <div className="count-textarea-inputs">Available characters: { (availableInputCharacters - textareaInputs.length < 0) ? 0 : availableInputCharacters - textareaInputs.length}</div>
            {textareaError && <div className="textarea-errors errorMessage">{ textareaError }</div>}
        </div>

        <div className="confirmation-section">
            <label className="confirmation-label" htmlFor="confirmation"><h2>Send confirmation:</h2></label>
            <div>
                <input type="radio" id="confirmation" name="confirmation" value='yes' checked={radioButtonSelection === 'yes' } onChange={(e) => setRadioButtonSelection(e.target.value)} /><span>YES</span>
            </div>
            <div>
                <input type="radio" id="confirmation" name="confirmation" value='no' checked={radioButtonSelection === 'no' } onChange={(e) => setRadioButtonSelection(e.target.value)} /><span>NO</span>
            </div>
            {radioButtonError && <div className="radiobutton-errors errorMessage">{ radioButtonError }</div>}
        </div>

        <div className="buttons-section">
            <button onClick={(e) => validateForm(e)} className="button submit-button">Submit</button>
            <button onClick={() => clearForm()} className="button clear-button">Clear</button>
        </div> 
    </form>
    )
}



// textareaInputs.length === 0 ? 'Text is required' : textareaInputs.length > 255 ? "You can't enter more than 255 characters" : ''
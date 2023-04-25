import { useEffect, useMemo, useState } from 'react';
import toBase64 from '../utils/convertBase64';

export const useForm = ( initialForm = {}, formValidations = {}) => {
  
    const [ formState, setFormState ] = useState( initialForm );
    const [ formValidation, setFormValidation ] = useState({});

    useEffect(() => {
        createValidators();
    }, [ formState ])

    useEffect(() => {
        setFormState( initialForm );
    }, [ initialForm ])
    
    
    const isFormValid = useMemo( () => {

        for (const formValue of Object.keys( formValidation )) {
            if ( formValidation[formValue] !== null ) return false;
        }

        return true;
    }, [ formValidation ])


    const onInputChange  = async ({ target }) => {
     
        const { name, value, type, checked, files } = target;

        if (type === 'checkbox') {
            setFormState((valueFormState) => ({ ...valueFormState, [name]: checked }));
          } else if (type === 'file') {
            setFormState((valueFormState) => ({ ...valueFormState, [name]: files[0] }));
          } else {
            setFormState((valueFormState) => ({ ...valueFormState, [name]: value }));
          }
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const createValidators = () => {
        
        const formCheckedValues = {};
        
        for (const formField of Object.keys( formValidations )) {
            const [ fn, errorMessage ] = formValidations[formField];

            formCheckedValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;
        }

        setFormValidation( formCheckedValues );
    }



    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormValid,
        setFormState
    }
}
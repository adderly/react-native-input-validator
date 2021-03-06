import React, {Component} from 'react';
import {Keyboard, TextInput, Text, StyleSheet, View} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import PropTypes from 'prop-types';
import validator from "validator";
import {Style} from "../style";

/**
 * Input Text
 * @author Marco Cesarato <cesarato.developer@gmail.com>
 */
class InputValidator extends Component {
    inputRef;
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        const value = this.parseValue(this.props.value);
        const validated = this.props.dirty ? this.props.dirty: true;

        this.state = {
            valid: validated,
            value: value,
            validated: validated,
            errorVisible: true,
            errorMessage: null,
            isFocused: this.props.value !== '' ? true : false,
        };
    }

    /**
     * Component did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if(typeof this.props.onRef === 'function') {
            this.props.onRef(this._isMounted ? this : undefined);
        }
        const props_value = this.parseValue(this.props.value);
        const state_value = this.parseValue();
        if (this.props.value == null){
        } else if(prevProps.value !== this.props.value) {
            this.validate(props_value);
        } else if (prevState.value !== state_value) {
            this.validate();
        }
    }

    /**
     * Component did mount
     */
    componentDidMount() {
        this._isMounted = true;
        if(typeof this.props.onRef === 'function') {
            this.props.onRef(this);
        }
        if (this.props.validateOnMount === true)
            this.validate();
    }

    /**
     * Component did unmount
     */
    componentWillUnmount() {
        this._isMounted = false;
        if(typeof this.props.onRef === 'function') {
            this.props.onRef(undefined);
        }
    }

    /**
     * Get locale
     * @returns {string}
     */
    getLocale(){
        return (this.props.locale != null ? this.props.locale : "any");
    }

    /**
     * Get input type
     * @returns {string}
     */
    getType(){
        return (this.props.type != null ? this.props.type : "");
    }

    /**
     * Null to empty
     * @param value
     * @returns string
     */
    parseValue(value = null) {
        if (value == null){
            value = this.state.value;
        }
        value = (value == null ? '' : value);
        value = String(value).trim();
        return value;
    }

    /**
     * Parse number type
     * @param num
     * @returns {*}
     */
    parseNum(num) {
        if (this.typeNumeric()) {
            num = parseInt(num);
        }
        if(isNaN(num)){
            num = 0;
        }
        return num;
    }

    /**
     * Get if validate
     * @returns {boolean}
     */
    isValidated() {
        return this.state.validated;
    }

    /**
     * Get if type is numeric
     */
    typeNumeric(){
        return (this.props.type === "int" ||
            this.props.type === "integer" ||
            this.props.type === "numeric" ||
            this.props.type === "float" ||
            this.props.type === "decimal" ||
            this.props.type === "real");
    }

    /**
     *
     */
    isValidMultiple(value = null) {
        let valid = true;
        let message = '';
        if (this.props.validations.length > 0) {
            var validation = null;
            for (var n = 0; n < this.props.validations.length;n++) {
                validation = this.props.validations[n];
                valid = this.validate(value, validation.type);
                if (valid == false){
                    if (validation.message && validation.message !== '')
                        message = validation.message;
                    break;
                }
            }
        }
        else valid = this.isValid(value, this.getType());

        return {valid : valid, message: message};
    }

    /**
     * Is valid
     * @param value
     * @returns {boolean}
     */
    isValid(value = null, type = null) {

        let is_valid = true;
        const text = this.parseValue(value).trim();

        if(this.props.required && validator.isEmpty(text)) {
            return false;
        }

        if (type == null)
            type = this.getType();

        switch (type) {
            case "length":
                //TODO: add this
                break;
            case "email":
                if (!validator.isEmail(text)) {
                    is_valid = false;
                }
                break;
            case "phone":
                if (!validator.isMobilePhone(text, this.getLocale())) {
                    is_valid = false;
                }
                break;
            case "currency":
                if (!validator.isCurrency(text, {symbol: this.props.symbol})) {
                    is_valid = false;
                }
                break;
            case "postal-code":
                if (!validator.isPostalCode(text, this.getLocale())) {
                    is_valid = false;
                }
                break;
            case "hex-color":
                if (!validator.isHexColor(text)) {
                    is_valid = false;
                }
                break;
            case "identity-card":
                if (!validator.isIdentityCard(text, this.getLocale())) {
                    is_valid = false;
                }
                break;
            case "credit-card":
                if (!validator.isCreditCard(text)) {
                    is_valid = false;
                }
                break;
            case "url":
                if (!validator.isURL(text)) {
                    is_valid = false;
                }
                break;
            case "numeric":
                if (!this.isNumeric(text) && !validator.isNumeric(text)) {
                    is_valid = false;
                }
                break;
            case "integer":
            case "int":
                if (!this.isNumeric(text) && !validator.isNumeric(text)) {
                    is_valid = false;
                }
                break;
            case "real":
            case "float":
                if (!this.isNumeric(text) && !validator.isFloat(text)) {
                    is_valid = false;
                }
                break;
            case "decimal":
                if (!this.isNumeric(text) && !validator.isDecimal(text)) {
                    is_valid = false;
                }
                break;
            case "alpha":
                if (!validator.isAlpha(text)) {
                    is_valid = false;
                }
                break;
            case "alphanumeric":
                if (!validator.isAlphanumeric(text)) {
                    is_valid = false;
                }
                break;
        }

        if (validator.isEmpty(text)){
            is_valid = !(this.props.required);
        }

        return is_valid;
    }

    /**
     * Validate
     * @param value
     * @returns {boolean}
     */
    validate(value = null) {
        const text = this.parseValue(value);
        const valid = this.isValid(text);
        this.setState({value: text, validated: valid,});
        return valid;
    }

    /**
     * 
     * @param {*} value 
     */
    getIsValid() {
        return !this.state.validated;
    }
    
    setValid(value) {
        this.setState({
            valid: value,
        });
    }

    //TODO: Remove
    dirty(value) {
        this.setDirty(value);
    }
    
    setDirty(value) {
        this.setState({ 
            validated: !value,
        });
    }

    setValidatorState(st : Object ) 
    {
        this.setState(st);
    }

    setErrorVisibility(which) {}

    /**
     * TODO: add better interface for this
     */
    setErrorString(errorString) {
        this.setState({errorMessage: errorString});
    }

    /**
     * Blur
     */
    blur() {
        this.input.blur();
        Keyboard.dismiss();
    }

    /**
     * Focus
     */
    focus() {
        this.input.focus();
    }

    /**
     * Update
     */
    update() {
        this.input.update();
    }

    /**
     * Clear
     */
    clear() {
        this.input.clear();
    }

    /**
     * On Focus
     * @param event
     * @param refName
     */
    onFocus(event, refName) {
        if (this.props.onFocus) {
            this.props.onFocus(event, refName);
        }
    }

    /**
     * On Blur
     */
    onBlur() {
        // Keyboard.dismiss();
        if (this.props.onBlur) {
            this.props.onBlur(arguments);
        }
    }

    /**
     * On Change Text
     * @param text
     */
    onChangeText(text, formatted) {
        this.validate(text);
        if (this.props.onChangeText) {
            let value = text;
            if(this.typeNumeric()){
                value = this.parseNum(value);
            }
            this.props.onChangeText(value, formatted);
        }
    }

    /**
     * On ending Editing
     * @param event
     */
    onEndEditing(event) {
        Keyboard.dismiss();
        if (this.props.onEndEditing) {
            this.props.onEndEditing(event);
        }
    }

    /**
     * Detect if is numeric
     * @param n
     * @returns {boolean}
     */
    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Is focused
     * @returns {*}
     */
    isFocused(){
        return this.input.isFocused();
    }

    renderIndicator() {
        if (this.props.renderBelowIndicator) {
            return this.props.renderBelowIndicator();
        }
    }

    /**
     * Render
     * @returns {*}
     */
    render() {

        let validStyle = (this.props.styleValid ? this.props.validStyle : Style.valid);
        let invalidStyle = (this.props.styleInvalid ? this.props.invalidStyle : Style.invalid);

        let props = {
            ...this.props,
            onBlur: this.onBlur.bind(this),
            onChangeText: this.onChangeText.bind(this),
            onEndEditing: this.onEndEditing.bind(this),
            onFocus: this.onFocus.bind(this),
            password: this.props.secureTextEntry || this.props.password, // Compatibility
            secureTextEntry: this.props.secureTextEntry || this.props.password, // Compatibility
            style: [Style.input, this.props.style],
        };

        if(!validator.isEmpty(this.parseValue())){
            props.style.push((this.state.validated ) ? validStyle : invalidStyle);
            // console.log(`
            //     valid = ${this.state.valid}
            // `);
        }

        let keyboardType = "default";
        if(this.typeNumeric()){
            keyboardType = "numeric";
        }

        if (this.props.type) {
            switch (this.props.type) {
                case "email":
                    keyboardType = "email-address";
                    break;
                case "int":
                case "integer":
                    keyboardType = "number-pad";
                    break;
                case "real":
                case "float":
                case "decimal":
                    keyboardType = "decimal-pad";
                    break;
                case "phone":
                    keyboardType = "phone-pad";
                    break;
            }
        }

        delete props.children;
        delete props.onRef;
        delete props.ref;

        if (props.editable === false) {
            props.pointerEvents = "none";
        }

        if (props.mask && !validator.isEmpty(props.mask)) {
            return(
                <TextInputMask
                refInput={r => { 
                    this.input = r;
                    if (typeof this.props.onRef === 'function') {
                        this.props.onRef(r)
                    }}
                }
                // onChangeText={(formatted, extracted) => {
                //     console.log(formatted) // +1 (123) 456-78-90
                //     console.log(extracted) // 1234567890
                // // }}
                // mask={"+1 ([000]) [000] [00] [00]"}
                keyboardType={keyboardType}
                autoFocus={false}
                underlineColorAndroid={'transparent'}
                {...props}
                />
            );
        }

        return (
            <TextInput
                ref={(r) => {
                    this.input = r;
                    if (typeof this.props.onRef === 'function') {
                        this.props.onRef(r)
                    }
                }}
                keyboardType={keyboardType}
                autoFocus={false}
                underlineColorAndroid={'transparent'}
                {...props}/>
        );
    }
}

InputValidator.propTypes = {
    type: PropTypes.string,
    validations: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    validateOnMount: PropTypes.bool,
    showInvalidWhenEmpty: PropTypes.bool,
    symbol: PropTypes.string,
    locale: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChangeText: PropTypes.func,
    onEndEditing: PropTypes.func,
    password: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    onRef: PropTypes.func,
    mask: PropTypes.string,
    dirty: PropTypes.bool,
    showTitle: PropTypes.bool,
    disabled: PropTypes.bool,
    titleTextStyle: Text.propTypes.style,
    characterRestriction: PropTypes.number,
    title: PropTypes.string,
    errorString: PropTypes.string,
    renderBelowIndicator: PropTypes.func
};

InputValidator.defaultProps = {
    type: 'default',
    validations : [],
    validateOnMount: true,
    showInvalidWhenEmpty: false,
    showTitle: false,

    underlineColorAndroid: 'transparent',
    disableFullscreenUI: true,
    autoCapitalize: 'sentences',
    editable: true,

    animationDuration: 225,

    fontSize: 16,
    labelFontSize: 12,

    tintColor: 'rgb(0, 145, 234)',
    textColor: 'rgba(0, 0, 0, .87)',
    baseColor: 'rgba(0, 0, 0, .38)',

    errorColor: 'rgb(213, 0, 0)',

    lineWidth: StyleSheet.hairlineWidth,
    activeLineWidth: 2,
    disabledLineWidth: 1,

    lineType: 'solid',
    disabledLineType: 'dotted',

    disabled: false,
};

export default InputValidator;
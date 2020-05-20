import React from 'react';
import PropTypes from 'prop-types';
import {Animated, Easing,/*TouchableOpacity,*/ View} from 'react-native';
import {Palette, Style, CleanStyle, DirtyStyle} from "../style";
import validator from "validator";
import InputValidator from "./InputValidator";
import Helper from './components/helper/index';
import Counter from './components/counter/index';

/**
 * Text Input Validator
 * @author Marco Cesarato <cesarato.developer@gmail.com>
 */
class InputValidatorPlaceholder extends InputValidator {

    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        const value = this.parseValue(this.props.value);
        const dirty = (!validator.isEmpty(value));

        this.styles = dirty ? DirtyStyle : CleanStyle;
        this.state = {
            ...this.state,
            dirty: dirty
        };
    }

    /**
     * Component did mount
     */
    componentDidMount() {
        this.setState({labelStyle: this.getLabelStyle()}, () =>{
            super.componentDidMount();
        });
    }

    /**
     * Component did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        const dirty = (!validator.isEmpty(this.parseValue()) || this.input.isFocused());
        if(prevState.dirty !== dirty) {
            this.setState({dirty: dirty});
            this.animate(dirty);
        }
    }

    /**
     * Get Label Style
     * @returns {{fontSize: *|AnimatedValue|AnimatedImplementation.Value, top: *|AnimatedValue|AnimatedImplementation.Value}}
     */
    getLabelStyle(){
        return {
            fontSize: new Animated.Value(this.styles.fontSize),
            top: new Animated.Value(this.styles.top)
        };
    }

    /**
     * Validate
     * @param value
     * @returns {boolean}
     */
    validate(value = null) {

        const valid = super.validate(value);
        const text = this.parseValue(value).trim();
        const dirty = (!validator.isEmpty(text) || this.input.isFocused());

        let labelStyle = this.getLabelStyle();

        if (valid === false && !this.props.required) {
            labelStyle.color = Palette.danger;
        } else if (!validator.isEmpty(text) && valid === true) {
            labelStyle.color = Palette.success;
        } else {
            labelStyle.color = Palette.normal;
        }

        this.animate(dirty);
        this.setState({labelStyle: labelStyle, dirty: dirty});

        return valid;
    }

    /**
     * Animate floating label
     * @param dirty
     */
    animate(dirty) {
        let nextStyle = dirty ? DirtyStyle : CleanStyle;
        let labelStyle = this.state.labelStyle;
        let anims = Object.keys(nextStyle).map(prop => {
            return Animated.timing(
                labelStyle[prop],
                {
                    toValue: nextStyle[prop],
                    duration: 200
                },
                Easing.ease
            )
        });

        Animated.parallel(anims).start();
    }

    /**
     * On Focus
     * @param event
     * @param refName
     */
    onFocus(event, refName) {
        this.animate(true);
        this.setState({dirty: true});
        super.onFocus(event, refName);
    }

    /**
     * On Blur
     */
    onBlur() {
        if (validator.isEmpty(this.parseValue())) {
            this.animate(false);
            this.setState({dirty: false});
        }
        super.onBlur(arguments);
    }

    /**
     * Render label
     * @returns {*}
     */
    renderLabel() {
        return (
            <Animated.Text
                ref='label'
                pointerEvents={"none"}
                numberOfLines={this.props.numberOfLines}
                style={[Style.label, this.props.labelStyle, this.state.labelStyle]}>
                {this.props.children} {this.props.required ? "(*)" : ""}
            </Animated.Text>
        )
    }

    renderHelper() {
        let { validated: valid } = this.state;
        // let title = 'title'
        // disabled = false
        // baseColor = 'white'
        // errorColor = 'red'
        // titleTextStyle = {}
        // characterRestriction = undefined
        // length = 100
        // style={ 
        //     color: 'red', 
        //     // backgroundColor: 'red'
        // }
        // limit = 100
        // count = 3
    
        let {
          title,
          disabled,
          baseColor,
          errorColor,
          errorString : error,
          titleTextStyle: style,
          characterRestriction: limit,
        } = this.props;
        
        console.log('Errir = >', error)

        // if (error == true) {
        //     // style.color = 'red'
        //     style.textColor = 'rgba(0, 0, 0, .87)',
        //     style.baseColo= 'rgba(0, 0, 0, .38)',

        //     style.errorColor= 'rgb(213, 0, 0)',
        //     style.backgroundColor = 'red'
        // } else {
            
        //     // style.color = 'red'
        //     style.backgroundColor = 'white'
            
        // }

        if (valid) {
            error = undefined;
        }
        
    
        let { length: count } = this.state.value; 
    
        let containerStyle =  {
          paddingLeft: 0,
          paddingRight:0,
          minHeight: 0,
        };
    
        let styleProps = {
          style,
          baseColor,
          errorColor,
        };
    
        let counterProps = {
          ...styleProps,
          limit,
          count,
        };
    
        let anim  =  new Animated.Value(0);
        let helperProps = {
          ...styleProps,
          title,
          error,
          disabled,
          focusAnimation: anim,
        };
    
        return (
          <View style={[{
            flex:0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            // height: 12
          }, containerStyle]}>
            <Helper {...helperProps} />
            <Counter {...counterProps} />
          </View>
        );
      }

    /**
     * Render
     * @returns {*}
     */
    render() {
        return (
            <View style={[{ 
                flex:1,
                flexDirection:"column",
                // backgroundColor: 'yellow',
                alignItems: 'flex-end',
                // justifyContent: 'flex-end',
                }]}>
                <View style={[Style.element, this.props.containerStyle]}>
                    {this.renderLabel()}
                    {super.render()}
                </View>
                {this.props.renderBelowIndicator ? super.renderIndicator() : this.renderHelper()}
            </View>
        );
    }
}

InputValidatorPlaceholder.propTypes = {
    labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

InputValidatorPlaceholder.defaultProps = {
    placeholder: "",
    containerstyle: {},
    labelstyle: {},
};

export default InputValidatorPlaceholder;
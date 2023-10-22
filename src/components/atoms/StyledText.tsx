import {StyleProp, Text, TextStyle} from "react-native";
import {ReactNode} from "react";

type StyledTextProps = {
  children: ReactNode
  style?: StyleProp<TextStyle>
  weight?: 400 | 500 | 600 | 900
}

const fontFamilies = {
  400: "SometypeMono-Regular",
  500: "SometypeMono-Medium",
  600: "SometypeMono-SemiBold",
  900: "SometypeMono-Bold"
}

const StyledText = (props: StyledTextProps) => {
  return <Text style={[{fontFamily: fontFamilies[props.weight || 400]}, props.style && props.style]}>{props.children}</Text>
}

export default StyledText

import { Text, TextProps } from "react-native";

type StyledTextProps = TextProps & {
  weight?: 400 | 500 | 600 | 900;
};

const fontFamilies = {
  400: "SometypeMono-Regular",
  500: "SometypeMono-Medium",
  600: "SometypeMono-SemiBold",
  900: "SometypeMono-Bold",
};

const StyledText = ({ weight = 400, style, ...rest }: StyledTextProps) => {
  return <Text style={[{ fontFamily: fontFamilies[weight] }, style]} {...rest} />;
};

export default StyledText;

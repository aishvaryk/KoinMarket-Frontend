import { Box } from "@mui/material";


interface FlexBoxProps {
  className?: string,
  justify? : string,
  align?: string,
  height? : string,
  width? : string,
  wrap? :string,
  customStyle?: Object,
  children: React.ReactNode;
}

export function FlexBox({className, justify = "start", align= "center", height = "100%", width = "100%", wrap = "wrap", customStyle, children}: FlexBoxProps) {
  var customSx = {
    display: "flex",
    justifyContent: justify,
    height:height,
    width: width,
    alignItems: align,
    flexWrap : wrap
}
customSx = {...customSx, ...customStyle}
  return (
    <Box  className={className} sx={customSx}>
    {children}
    </Box>
  );
}

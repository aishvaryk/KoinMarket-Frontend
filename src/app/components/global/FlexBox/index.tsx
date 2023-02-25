import { Box } from "@mui/material";


interface FlexBoxProps {
  className?: string,
  justify? : string,
  align?: string,
  height? : string,
  width? : string,
  wrap? :string,
  children: React.ReactNode;
}

export function FlexBox({className, justify = "start", align= "center", height = "100%", width = "100%", wrap = "wrap", children}: FlexBoxProps) {
  
  return (
    <Box  className={className} sx={{
      display: "flex",
      justifyContent: justify,
      height:height,
      width: width,
      alignItems: align,
      flexWrap : wrap
  }}>
    {children}
    </Box>
  );
}

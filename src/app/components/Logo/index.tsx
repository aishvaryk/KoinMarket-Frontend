import Image from "next/image";

interface LogoProps {
  height?: number;
  width?: number;
}

export function Logo(props: LogoProps) {
  if (props.height && props.width) {
    return (
      <Image
        src="/logo.png"
        alt="logo"
        height={props.height}
        width={props.width}
      ></Image>
    );
  }
  return (
    
      <Image
        src="/logo.png"
        alt="logo"
        fill
        object-fit="contain"
      ></Image>
  );
}

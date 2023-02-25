import Image from 'next/image'

export function Logo() {
    return (
      <Image src="../../../../public/logo.svg" alt="logo" height={500} width={500}></Image>
    );
}

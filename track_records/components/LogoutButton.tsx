'use client'

import React from 'react'
import Image from 'next/image'

type ButtonProps = {
    type: 'button' | 'submit';
    title: string;
    icon?: string;
    variant: 'btn_dark_green';
}

const Button = ({type, title, icon, variant}) => {
  return (
    <button type={type} className={`flexCenter gap-3 rounded-full border ${variant}`} onClick={e => console.log("WE NEED TO IMPLEMENT LOGGING OUT")}>
        {icon && <Image src={icon} alt={title} width={24} height={24} />}
        <label className="bold-16 whitespace-nowrap">
            {title}
        </label>
    </button>
  )
}

export default Button
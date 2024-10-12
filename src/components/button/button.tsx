import { IButtonProps } from './button.props';

import styles from './button.module.css';

export const Button = ({
  children,
  isPrimary = true,
  className,
  isActive = false,
  ...props
}: IButtonProps) => {
  return (
    <button
      className={`${isPrimary ? styles.btn : styles.addition} ${isActive ? styles.active : ''} ${className ? className : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

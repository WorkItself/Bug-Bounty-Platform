import styles from './Input.module.css';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
}

const Input = ({ type = 'text', placeholder, value, onChange, name }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={styles.input}
    />
  );
};

export default Input;

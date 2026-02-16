import styles from './Input.module.css';

const Input = ({ type = 'text', placeholder, value, onChange, name }) => {
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

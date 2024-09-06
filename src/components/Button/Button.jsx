import './Button.css'

export const Button = ({className, children, ...props}) => {

	const css = 'btn ' + className

	return (
		<button {...props} className={css}>{ children }</button>
	)
}
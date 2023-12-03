import styles from '../Insurance/Insurance.module.scss'

type UserContactData = {
    phone_number: string,
    email: string,
    address: string,
    passport_number: string,
}

type Props = UserContactData & {
    title?: string,
    updateFields: (fields: Partial<UserContactData>) => void
}

export default function ContactForm({ title, address, email, passport_number, phone_number, updateFields }: Props) {

    return (
        <>
            {title !== undefined ? <h1 className={styles.title}>{title}</h1> : null}

            <div className={styles.row}>
                <label>
                    <input value={phone_number}
                        onChange={e => updateFields({ phone_number: e.target.value })}
                        required type="tel" name="phone number" />

                    <h4>Phone number</h4>
                </label>

                <label>
                    <input value={email}
                        onChange={e => updateFields({ email: e.target.value })}
                        required type="email" name="email" />

                    <h4>Email</h4>
                </label>
            </div>

            <label>
                <input value={address}
                    onChange={e => updateFields({ address: e.target.value })}
                    required type="text" name="address" />

                <h4>Address</h4>
            </label>

            <label>
                <input value={passport_number}
                    onChange={e => updateFields({ passport_number: e.target.value })}
                    required type="number" name="passport number" />

                <h4>Passport number</h4>
            </label>

        </>
    )
}

import styles from '../Insurance/Insurance.module.scss'

type PetData = {
    name: string,
    type: string,
    birthDate: string,
    weight: string,
    breed: string,
    gender: string,
}

type Props = PetData & {
    title?: string,
    updateFields: (fields: Partial<PetData>) => void
}

const pets = [
    "dog", "cat", "rabbit", "hamster", "turtle", "bird", "fish",
    "snake", "lizard", "horse", "chinchilla", "hedgehog", "rat", "mouse",
    "guinea pig", "tarantula", "frog"
]

export default function PetForm({ title, birthDate, breed, gender, name, type, weight, updateFields }: Props) {

    return (
        <>
            {title !== undefined ? <h1 className={styles.title}>{title}</h1> : null}

            <label>
                <input required type="text" name="name"
                    value={name}
                    onChange={e => updateFields({ name: e.target.value })}
                />

                <h4>Pet's name</h4>
            </label>

            <label>
                <select required name="type" value={type} onChange={e => updateFields({ type: e.target.value })} >
                    <option selected disabled value=''>Select pet</option>
                    {pets.map(pet => <option key={pet} value={pet}>{pet}</option>)}
                </select>

                <h4>What Pet Do You Own?</h4>
            </label>

            <div className={styles.row}>

                <label>
                    <input required type="date"
                        value={birthDate}
                        onChange={e => updateFields({ birthDate: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 30)).toISOString().split('T')[0]}
                        name="birthDate" />

                    <h4>Birth date</h4>
                </label>

                <label>
                    <input required type="number" step="0.05" name="weight"
                        value={weight}
                        onChange={e => updateFields({ weight: e.target.value })}
                    />
                    <div className={styles.unit}>kg</div>

                    <h4>Weight</h4>
                </label>
            </div>


            <div className={styles.row}>
                <label>
                    <input required name="breed" type='text'
                        value={breed}
                        onChange={e => updateFields({ breed: e.target.value })}
                    />

                    <h4>Breed</h4>
                </label>

                <label>
                    <select value={gender}
                        onChange={e => updateFields({ gender: e.target.value })}
                        required name="gender"  >
                        <option value="" disabled selected>Gender</option>
                        <option value="male">boy</option>
                        <option value="female">Girl</option>
                    </select>

                    <h4>Gender</h4>
                </label>
            </div>

        </>
    )
}

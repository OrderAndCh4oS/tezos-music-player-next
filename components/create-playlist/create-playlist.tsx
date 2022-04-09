import {FC} from "react";
import usePlaylist from "../../hooks/use-playlist";
import {Field, Form, Formik} from "formik";
import {InferType, object, string} from "yup";
import styles from './styles.module.css';

const playlistSchema = object({
    title: string().required(),
});

const CreatePlaylistComp: FC = () => {
    const {playlistCollection} = usePlaylist();
    const initialValues = {
        title: ''
    }

    const handleSubmit = ({title}: InferType<typeof playlistSchema>) => {
        playlistCollection!.add(title);
    };

    return (
        <div>
            <h2>Create Playlist</h2>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={playlistSchema}
            >
                <Form>
                    <Field name='title'/>
                    <button type='submit' className={styles.createButton}>Create</button>
                </Form>
            </Formik>
        </div>
    )
};

export default CreatePlaylistComp;

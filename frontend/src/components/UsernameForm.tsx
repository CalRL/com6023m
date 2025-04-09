import {useState, useEffect} from 'react';

const UsernameForm = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    const handleChange = (event) => {
        setUsername(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmissionMessage(null);
        setError(null);

        try {
            const response = await axios.put('api/users', { username: username } ); {
                if(response.status !== 201) {
                    //todo: handle logic on fail
                    console.log('failure!')
                    return;
                }

            }
        }
    }
    return
}


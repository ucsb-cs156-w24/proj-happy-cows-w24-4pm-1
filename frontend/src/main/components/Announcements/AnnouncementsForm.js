import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import { useNavigate } from 'react-router-dom';


function AnnouncementsForm({initialContents, submitAction, buttonLabel = "Create"}) {

    const {
        register,
        formState: {errors},
        handleSubmit,
    } = useForm(
        // modifiedCommons is guaranteed to be defined (initialCommons or {})
        {defaultValues: initialContents || {}, }
    );

    const navigate = useNavigate();
    const testIdPrefix = "AnnouncementsForm-";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialContents && (
                <row>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="id">Id</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "id"}
                            id="id"
                            type="text"
                            {...register("id")}
                            value={initialContents.id}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="commonsId">Commons Id</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "commonsId"}
                            id="commonsId"
                            type="text"
                            {...register("commonsId")}
                            value={initialContents.commonsId}
                            disabled
                        />
                    </Form.Group>
                </row>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="start">Start Time (iso format)</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "start"}
                    id="start"
                    type="datetime-local" 
                    isInvalid={Boolean(errors.start)}
                    {...register("start", {
                        required: "Start is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.start?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="end">End Time (iso format)</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "end"}
                    id="end"
                    type="datetime-local" 
                    isInvalid={Boolean(errors.end)}
                    {...register("end")}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.end?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="announcement">Announcement Message</Form.Label>
                <Form.Control
                    //as="textarea" 
                    //rows={4}
                    data-testid={testIdPrefix + "announcement"}
                    id="announcement"
                    type="text"
                    isInvalid={Boolean(errors.announcement)}
                    {...register("announcement", {
                        required: "Announcement is required.",
                    })}
                >
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {errors.announcement?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "cancel"}
            >
                Cancel
            </Button>
        </Form>

    );

}
export default AnnouncementsForm;
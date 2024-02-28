import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";


function AnnouncementsForm({initialAnnouncements, submitAction, buttonLabel = "Create"}) {
    
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm(
        // modifiedCommons is guaranteed to be defined (initialCommons or {})
        {defaultValues: initialAnnouncements}
    );

    const testIdPrefix = "announcementsForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="start">Announcement Start</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-start"}
                    id="start"
                    type="datetime-local" 
                    isInvalid={Boolean(errors.start)}
                    {...register("start", {
                        required: "start is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                {errors.start?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="end">Announcement End</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-end"}
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
                <Form.Label htmlFor="announcement">announcement</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-announcement"}
                    id="announcement"
                    type="text"
                    isInvalid={Boolean(errors.announcement)}
                    {...register("announcement", {
                        required: "announcement is required.",
                    })}
                >
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {errors.announcement?.message}
                </Form.Control.Feedback>
            </Form.Group>



            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>

        </Form>

    );



}
export default AnnouncementsForm;
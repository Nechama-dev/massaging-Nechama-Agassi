import React, { useState, useRef, useEffect } from 'react'
import { TextField, Typography, Button } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { v1 as uuidv1 } from 'uuid';
import { connect } from 'react-redux'
import { addGroup } from '../../redux'
import { deleteGroup } from '../../redux'
import useRooms from './useRooms';

function Create_room(props) {

    const [room, setRoom] = useState("");
    const { rooms, addRoom, deleteRoom, joinRoom } = useRooms();
    const [error, setError] = useState("");

    const addRoomToSocket = () => {

        if (room === "") {
            setError("group name are required");
            return;
        }
        console.log("add", room)

        addRoom(room);
        props.addGroup(rooms)
    };

    const deleteGroup = (roomToDelete) => {

        props.deleteGroup(roomToDelete);
        deleteRoom(roomToDelete)

           
    };
    return (
        <div>
            <div>
                <form>
                    <Typography variant="h5" style={{ marginBottom: 8 }}>
                        create group
                    </Typography>
                    <TextField
                        label="group name"
                        variant="outlined"
                        className="form-input"
                        value={room}
                        onChange={e => setRoom(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className="form-input"
                        size="large"
                        onClick={addRoomToSocket}
                    >
                        Add
                    </Button>
                    {error && (
                        <Alert severity="error" onClick={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                </form>
            </div>
            <div>

                {
                    props.groups.map((d) =>
                        <ul key={d}>
                            <li key={d}>{d}</li>
                            <button onClick={() => deleteGroup(d)}>delete</button>
                        </ul>
                    )
                }
            </div>
        </div>
    )
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const mapStateToProps = state => {
    return {
        groups: state.group.groups,
    }
}

const mapDispachToProps = dispatch => {
    return {
        addGroup: group => dispatch(addGroup(group)),
        deleteGroup: groupId => dispatch(deleteGroup(groupId))
    }
}

export default connect(mapStateToProps, mapDispachToProps)(Create_room)

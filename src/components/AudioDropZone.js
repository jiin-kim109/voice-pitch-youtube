import React, {useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
    flex: 1,
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'lightGray`',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function AudioDropZone(props){
    const onDrop = useCallback(file => props.onDrop(file));
    const {
        getRootProps, 
        getInputProps,
        isDragActive,
        isDragReject,
        isDragAccept,
    } = useDropzone({
        multiple: false,
        accept: 'audio/*',
        onDrop,
    });
    const style = useMemo(() => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }), [
      isDragActive,
      isDragReject,
      isDragAccept
    ]);

    return(
        <section {...getRootProps({style})}>
            <input {...getInputProps()} />
            <p>Drag audio file here, or click to select file</p>
        </section>
    );
}
export default AudioDropZone;
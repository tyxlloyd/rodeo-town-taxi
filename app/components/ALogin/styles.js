import {
  
    StyleSheet,
  

} from 'react-native';


//find a way to center text in button
const styles = StyleSheet.create({

    loginInput: {

        marginLeft: 20,
        marginRight: 20,
        fontSize: 25,
        borderBottomColor: '#000000',
        //borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 1
    },
    container: {

        flex: 1,
        backgroundColor: '#FFC005',
        //alignItems: "center"


    },
    titleContainer: {

        flex: 3,
        backgroundColor: '#FFD772',
        //alignItems: "center",

    },

    titleText: {

        // Define font size here in Pixels
        fontSize: 45,
        textAlign: "center"
    },
    
    buttonText: {
        fontSize: 30,



    },
    button: {

        padding: 10,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white',
        width: 250,
        alignItems: 'center'


    },

    buttonContainer: {

        flex: 4,
        backgroundColor: '#FFDE03',
        justifyContent: "space-around",
        alignItems: "center",


    }
});
export default styles
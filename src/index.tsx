import { FunctionalComponent, h, render } from "preact"
import { connect, Provider } from "react-redux"
import { createStore, Action, AnyAction } from "redux"



const root = document.getElementById("root")


const make_leak1 = true
const make_leak2 = true



const trigger_leak = async (num: number = 100) =>
{
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    while (num-- > 0)
    {
        store.dispatch({ type: "op" })
        await wait(10)
    }

    root!.append("Done.")
}



const map_state = () => ({ val: make_leak1 ? {} : 1 })
const connector = connect(map_state)

function _SimpleConnectedComponent ()
{
    return <div></div>
}
const SimpleConnectedComponent = connector(_SimpleConnectedComponent) as FunctionalComponent<{}>


function App()
{
    return (
        <div>
            App
            <button onPointerDown={() => trigger_leak()}>Trigger leak</button>
            {Array.from(Array(1000)).map(i => <SimpleConnectedComponent key={i} />)}
        </div>
    )
}



const root_reducer = (state: {}, action: AnyAction) => make_leak2 ? { ...state } : state
const store = createStore<{}, Action, {}, {}>(root_reducer as any, { a: 1 })


if (root)
{
    render(<Provider store={store}><App /></Provider>, root)
}

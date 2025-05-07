import '../../App.css';
import {FC} from from 'react';
import { RxGear } from "react-icons/rx";

const SettingsButton   = () => {
    return(
        <div className="flex space-y-8">
            <RxGear />
            <span className="text-2xl">Settings</span>
        </div>
    )
}

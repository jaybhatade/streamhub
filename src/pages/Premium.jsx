import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path matches your firebase config file
import HeaderTwo from "../components/HeaderTwo";
import { Link } from 'react-router-dom';

function Premium() {
    const [userPackage, setUserPackage] = useState(null);
    const [loading, setLoading] = useState(true);

    const packages = [
        { id: 'V',name:'Vip Pack', image: './images/offer1.png', maxWidth: '380px', leftOffset: '-5%' },
        { id: 'P',name:'Premium Pack', image: './images/offer2.png', maxWidth: '350px', leftOffset: '0' },
        { id: 'B',name:'Basic Pack', image: './images/offer2 (1).png', maxWidth: '350px', leftOffset: '0' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchUserPackage();
    }, []);

    const fetchUserPackage = async () => {
        try {
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
                const userRef = doc(db, 'users', userEmail);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserPackage(userData.packageName);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user package:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='w-full h-screen bg-black flex items-center justify-center'>
                <div className='text-white'>Loading...</div>
            </div>
        );
    }

    return (
        <div className='w-full h-fit min-h-screen bg-black'>
            <HeaderTwo title={"Premium"} />
            <div className='pt-16 flex w-full justify-center p-4 z-10'>
                <div className='w-fit h-fit items-center gap-8 flex-col rounded-lg p-4 flex'>
                    <h2 className="text-white text-2xl font-bold mb-3 text-center shadow-lg p-4 rounded-lg">
                        Active Pack: <span className="text-yellow-300">{userPackage}</span>
                    </h2>
                    {packages.map((pack) => (
                        // Only show packages that aren't the user's current package
                        userPackage !== pack.name && (
                            
                            <Link key={pack.id} to={`/payment/${pack.id}`}>
                                <img 
                                    src={pack.image} 
                                    alt={`Package ${pack.id}`} 
                                    className='w-[100%] hover:scale-90 transition-all ease-in-out duration-300 z-[2]'
                                    style={{
                                        maxWidth: pack.maxWidth,
                                        position: 'relative',
                                        left: pack.leftOffset
                                    }}
                                />
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Premium;
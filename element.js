const element = {
    title: 'Nápověda',
    _path: '/help',
    children: [
        {
            title: 'Úložiště pro audio',
            _path: '/help/audio-storage',
            children: [
                {
                    title: 'Dropbox',
                    _path: '/help/audio-storage/dropbox',
                    description: 'Jak přidat audio z Dropboxu',
                    slug: 'dropbox'
                },
                {
                    title: 'Microsoft OneDrive',
                    _path: '/help/audio-storage/onedrive',
                    description: 'Jak přidat audio z Microsoft OndeDrive',
                    slug: 'onedrive'
                },
                {
                    title: 'Hearthis.at',
                    _path: '/help/audio-storage/hearthis.at',
                    description: 'Jak přidat audio z Hearthis.at',
                    slug: 'hearthis'
                }
            ]
        },
        {
            title: 'Často kladené otázky',
            _path: '/help/faq',
            children: [
                {
                    title: 'Základní FAQ',
                    _path: '/help/faq/basic'
                }
            ]
        }
    ]
}

function getNavPath(element, matchingPath, navPath = []) {
    if (element._path === matchingPath) {
        navPath.push({ title: element.title, path: element._path })
        return navPath.reverse()
    } else if (element.children != null) {
        let result = null
        for (let i = 0; result == null && i < element.children.length; i++) {
            result = getNavPath(element.children[i], matchingPath, navPath)
        }
        navPath.push({ title: element.title, path: element._path })
        return result
    }
    return null
}

const navPath = getNavPath(element, '/help/audio-storage')

console.log(navPath)
